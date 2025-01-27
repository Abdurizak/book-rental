import {createContext,useEffect,useState} from "react"
import { useNavigate } from "react-router-dom";
export const UserContext =createContext();
import {toast} from "react-toastify"


export const UserProvider = ({children}) => 
{
    const navigate = useNavigate()
    const [authToken , setAuthToken] = useState( ()=> sessionStorage.getItem("token")  )
    const [current_user, setCurrentUser] = useState(null)
    const addUser = (username,email,password,grade,role) => {
        toast.loading("...Adding User")
        fetch ("http://127.0.0.1:5000/users",{
            method: "POST",
            headers: {
            "Content-Type":"application/json",
            },
            body:JSON.stringify({username,email,password,grade,role})
            
        })
        .then((resp)=>resp.json())
        .then((response)=>{
            console.log(response);
            
            if(response.success){
                toast.dismiss()
                toast.success(response.success)
                navigate("/Login")
            }
            else if(response.error){
                toast.dismiss()
                toast.error(response.error)

            }
            else{
                toast.dismiss()
                toast.error("Failed to add")

            }
          })
    }  

// LOGIN
const login = (email, password) => 
    {
        toast.loading("Logging you in ... ")
        fetch("http://127.0.0.1:5000/login",{
            method:"POST",
            headers: {
                'Content-type': 'application/json',
              },
            body: JSON.stringify({
                email, password
            })
        })
        .then((resp)=>resp.json())
        .then((response)=>{
            if(response.access_token){
                toast.dismiss()

                sessionStorage.setItem("token", response.access_token);

                setAuthToken(response.access_token)

                fetch('http://127.0.0.1:5000/current_user',{
                    method:"GET",
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${response.access_token}`
                    }
                })
                .then((response) => response.json())
                .then((response) => {
                  if(response.email){
                          setCurrentUser(response)
                        }
                });

                toast.success("Successfully Logged in")
                navigate("/")
            }
            else if(response.error){
                toast.dismiss()
                toast.error(response.error)

            }
            else{
                toast.dismiss()
                toast.error("Failed to login")

            }
          
            
        })
    };
    const logout = async () => 
        {
            sessionStorage.removeItem("token");
            setAuthToken(null)
            setCurrentUser(null)
    
        };

        useEffect(()=>{
            fetchCurrentUser()
        }, [])
        const fetchCurrentUser = () => 
        {
            console.log("Current user fcn ",authToken);
            
            fetch('http://127.0.0.1:5000/current_user',{
                method:"GET",
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                }
            })
            .then((response) => response.json())
            .then((response) => {
              if(response.email){
               setCurrentUser(response)
              }
            });
        };
    

    const getUsers  = () => {
        console.log("Fetching all Users")
    }
    
    const UpdateUser = () => {
        console.log("Update User")
    }

    const DeleteUser = async (userId) => {
        console.log("Delete user:", userId)
    }
    
    const data = {
        login,
        logout,
        fetchCurrentUser,
        getUsers,
        DeleteUser,
        UpdateUser,
        addUser
    }

    return(
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}