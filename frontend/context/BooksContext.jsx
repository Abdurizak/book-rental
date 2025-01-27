import {createContext} from "react"

export const BooksContext =createContext();

export const BooksProvider = ({children}) => 
{
    const addBooks = () => {
        console.log("Add a book")
    }

    const getBooks = () => {
        console.log("Fetching all Books")
    }

    const getBooksById  = () => {
        console.log("Fetching a single Books")
    }
    
    const UpdateBooks = () => {
        console.log("Update Book")
    }

    const DeleteBooks = () => {
        console.log("Delete book")
    }
    
    const data = {
        addBooks,
        getBooks,
        getBooksById,
        UpdateBooks,
        DeleteBooks
    }

    return(
        <BooksContext.Provider value={data}>
            {children}
        </BooksContext.Provider>
    )
}