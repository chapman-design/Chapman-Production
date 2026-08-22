const fs = require('fs');

const data = {
  type: "reviews_list",
  title: "Client Perspectives",
  content: "Over three decades and more than 800 residential commissions across Silicon Valley and the Peninsula, our practice has been built almost entirely on client referrals and enduring relationships. Here is what homeowners share about partnering with Chapman Design Associates.",
  reviews: [
    {
      "quote": "Working with Walter Chapman was an exceptional experience from concept through completion. He listened intently to our lifestyle needs and crafted an architectural plan that maximized natural light and seamless indoor-outdoor flow. His deep familiarity with local planning departments made the permit approval process in Los Altos remarkably smooth.",
      "author": "Private Homeowner",
      "location": "Los Altos, CA",
      "projectType": "Custom Single-Family Residence",
      "source": "Houzz",
      "rating": 5,
      "year": "2024"
    },
    {
      "quote": "Chapman Design Associates transformed our mid-century home into a contemporary architectural masterpiece while honoring the neighborhood context. Walter's structural clarity, attention to sightlines, and coordination with our engineer and general contractor saved us substantial time and construction expense.",
      "author": "The D. Family",
      "location": "Old Palo Alto, CA",
      "projectType": "Major Renovation & 2nd Story Addition",
      "source": "Houzz",
      "rating": 5,
      "year": "2023"
    }
  ],
  badges: [
    {
      "platform": "Houzz",
      "url": "https://www.houzz.com",
      "label": "Read Verified Reviews on Houzz"
    }
  ]
};

console.log(JSON.stringify(data));
