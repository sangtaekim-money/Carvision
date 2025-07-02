import React from 'react';
import Header from '../components/ui/Header.jsx';
import Hero from '../components/ui/Hero.jsx';
import Search from '../components/ui/search.jsx';
import AllCar from '../components/ui/AllCar.jsx';
import Category from '../components/ui/Category.jsx';
import Listings from '../components/ui/Listings.jsx';
import Howtobuy from '../components/ui/Howtobuy.jsx';
import Footer from '../components/ui/Footer.jsx';
import Stickybottommenu from '../components/ui/Stickybottommenu.jsx';
import RecentCar from '../components/ui/RecentCar.jsx';
import SoldOut from '../components/ui/soldout.jsx';



function HomePage() {
  return (
    <div className="homepage">
      <Header />
      
      <Search /> {/* Add the Search component here */}
      <Hero />
      <Category />
      <RecentCar />
      <Listings />
      <SoldOut />
      <AllCar />
      <Howtobuy />
      <Footer />
      <Stickybottommenu />
    </div>
  );
}

export default HomePage;