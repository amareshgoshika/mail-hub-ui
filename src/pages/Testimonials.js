import React from 'react';
import PropTypes from 'prop-types';

const testimonials = [
  {
    id: 1,
    text: "MailEazy is incredibly user-friendly and made performing email operations so much simpler. Highly recommend!",
    name: "Aditi Sharma",
    date: "December 18, 2024"
  },
  {
    id: 2,
    text: "I’ve been using MailEazy for months now, and it’s hands down the easiest email management tool I've come across.",
    name: "Rahul Verma",
    date: "November 24, 2024"
  },
  {
    id: 3,
    text: "MailEazy has truly transformed the way I handle my email campaigns. Fast, easy, and intuitive.",
    name: "Priya Iyer",
    date: "October 5, 2024"
  },
  {
    id: 4,
    text: "The simplicity of MailEazy makes it my go-to choice. Email tasks are now quick and effortless. Love it!",
    name: "Vikram Reddy",
    date: "September 18, 2024"
  },
  {
    id: 5,
    text: "Using MailEazy has been a breeze. It's the perfect tool for those who need quick and easy email operations.",
    name: "Simran Kaur",
    date: "August 30, 2024"
  },
  {
    id: 6,
    text: "I was looking for a reliable and simple email solution, and MailEazy has exceeded my expectations. So easy to use!",
    name: "Ankit Mehta",
    date: "August 10, 2024"
  }
];


function Testimonials() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
          What Our Clients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <svg
                  className="absolute -top-4 -left-4 h-8 w-8 text-indigo-400 opacity-25"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-lg text-gray-700 italic relative z-10 mb-4">
                  {testimonial.text}
                </p>
              </div>
              <div className="mt-4 border-t border-indigo-100 pt-4">
                <p className="font-semibold text-indigo-900">{testimonial.name}</p>
                <p className="text-sm text-indigo-600">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Testimonials.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired
    })
  )
};

export default Testimonials;
