function Home() {
  const people = [
    {
      name: 'Peter Garfield',
      role: 'Library Assistant',
      imageUrl: 'https://media.istockphoto.com/id/1301234881/photo/portrait-of-successful-hispanic-business-man-looks-directly-at-the-camera-smile-happy-male.webp?a=1&b=1&s=612x612&w=0&k=20&c=EXlYVOFj2q5YtwYSpU60XPK7OGNMYU-eOLdQNrMPKUo=', // Example placeholder image
    },
    {
      name: 'Sueann Anita',
      role: 'Head of Library Services',
      imageUrl: 'https://media.istockphoto.com/id/482262972/photo/portrait-of-female-bookshop-owner.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZuNQGT1OLNTU9lRqMaw8i_7dgISIQPuLZ37Km1godng=',
    },
    {
      name: 'Mike Sonko',
      role: 'Book Receiver',
      imageUrl: 'https://media.istockphoto.com/id/533741653/photo/salesman-at-the-checkout-in-a-bookstore.webp?a=1&b=1&s=612x612&w=0&k=20&c=D_XBp7iqcFWOnNXo-_JzBE6ph12PVImRKNiGi1PSHX4=',
    },
    {
      name: ' Ann Kimberly',
      role: 'Technical Assistant',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1681681082298-098ae4d48c2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGlicmFyeSUyMGFzc2lzdGFudHxlbnwwfHwwfHx8MA%3D%3D',
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      {/* Leadership Section */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Meet Our Leadership
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
        We are a passionate and dedicated team, united by our love for books and our commitment to providing exceptional service. 
        Each member brings unique expertise and enthusiasm, working collaboratively to create the best possible experience for our library community. 
        Our shared goal is to inspire, educate, and make a positive impact through the power of books.
        </p>
      </div>

      {/* Leaders Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12">
        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:grid-cols-4">
          {people.map((person) => (
            <li key={person.name}>
              <div className="flex items-center gap-x-6">
                <img alt={person.name} src={person.imageUrl} className="h-16 w-16 rounded-full" />
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-gray-900">{person.name}</h3>
                  <p className="text-sm font-semibold text-indigo-600">{person.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* About Us Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-full mx-auto px-8 lg:px-8">
          {/* Header Section */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-indigo-600">About Us</p>
            <h2 className="text-4xl font-semi-bold tracking-tight text-gray-900 sm:text-4xl">
              On a Mission to Empower Remote Teams
            </h2>
            <p className="mt-4 text-xl text-gray-600">
            At Heaven of Pages, we believe in the power of knowledge, collaboration, and seamless communication. 
            Our mission is to empower remote teams by providing them with the resources they need to stay connected, engaged, and productive, no matter where they are. 
            By curating a vast collection of books and resources, we aim to support personal and professional growth for individuals working in dynamic, remote environments.
            </p>
          </div>

          {/* Content Section */}
          <div className="mt-16">
            {/* Left Text - Centered */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our mission is to revolutionize the way remote teams access knowledge and stay connected. 
              We strive to make learning and development accessible to everyone, regardless of location. 
              By offering a diverse range of books and digital content, we aim to nurture a culture of continuous learning and collaboration within remote teams.
              </p>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              At Heaven of Pages, we are a team of book lovers and remote work enthusiasts who understand the challenges of staying connected and motivated in a virtual world. 
              Our goal is to provide remote teams with the tools they need to grow, learn, and succeed together. 
              From insightful books on team collaboration to guides for personal development, we are here to support the journey of every remote professional. 
              Through our carefully curated collection, we strive to inspire, educate, and foster a thriving remote work culture.
              </p>
            </div>

            {/* Images - Centered Container */}
            <div className="mt-12 flex justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-4xl">
                <img
                  className="rounded-xl object-cover w-full h-48 sm:h-64"
                  src="https://images.unsplash.com/photo-1569878766010-17bff0a1987d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxpYnJhcnl8ZW58MHx8MHx8fDA%3D"
                  alt="Teamwork 1"
                />
                <img
                  className="rounded-xl object-cover w-full h-48 sm:h-64"
                  src="https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Teamwork 2"
                />
                <img
                  className="rounded-xl object-cover w-full h-48 sm:h-64"
                  src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxpYnJhcnl8ZW58MHx8MHx8fDA%3D"
                  alt="Teamwork 3"
                />
                <img
                  className="rounded-xl object-cover w-full h-48 sm:h-64"
                  src="https://media.istockphoto.com/id/483636107/photo/businesspeople-in-office-meeting.webp?a=1&b=1&s=612x612&w=0&k=20&c=b-iEWi0KrFrLKu1CvrhKBh1XD8XujBngtZsOkq2aYAs="
                  alt="Teamwork 4"
                />
              </div>
            </div>
          </div>

          {/* Numbers Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center">The Numbers</h3>
            <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">$8M</p>
                <p className="mt-1 text-gray-600">Books</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">2M</p>
                <p className="mt-1 text-gray-600">Subscribers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">5.4M</p>
                <p className="mt-1 text-gray-600">Borrowed Books</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">3.8M</p>
                <p className="mt-1 text-gray-600">Guests and Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;