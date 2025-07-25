import Layout from "./Layout.jsx";

import Home from "./Home";

import DishDetails from "./DishDetails";

import PostDish from "./PostDish";

import Checkout from "./Checkout";

import OrderTracking from "./OrderTracking";

import Search from "./Search";

import Cart from "./Cart";

import Profile from "./Profile";

import AddAddress from "./AddAddress";

import Chat from "./Chat";

import SchedulePost from "./SchedulePost";

import Notifications from "./Notifications";

import SpecialOffers from "./SpecialOffers";

import Settings from "./Settings";

import Help from "./Help";

import Onboarding from "./Onboarding";

import EditProfile from "./EditProfile";

import OrderDetails from "./OrderDetails";

import ReportIssue from "./ReportIssue";

import PaymentMethod from "./PaymentMethod";

import NotificationSettings from "./NotificationSettings";

import SavedAddresses from "./SavedAddresses";

import Reviews from "./Reviews";

import LanguageSettings from "./LanguageSettings";

import MyDishes from "./MyDishes";

import EarningsPayouts from "./EarningsPayouts";

import DietaryPreferences from "./DietaryPreferences";

import FavoriteCooks from "./FavoriteCooks";

import ReportCook from "./ReportCook";

import SavedDishes from "./SavedDishes";

import Categories from "./Categories";

import Activity from "./Activity";

import BuyerProfile from "./BuyerProfile";

import CookProfile from "./CookProfile";

import Ingredients from "./Ingredients";

import CookingClasses from "./CookingClasses";

import MealPlanning from "./MealPlanning";

import Community from "./Community";

import Gifting from "./Gifting";

import Recipes from "./Recipes";

import FreeMeals from "./FreeMeals";

import OrderReview from "./OrderReview";

import MyReviews from "./MyReviews";

import Messages from "./Messages";

import CookDashboard from "./CookDashboard";

import TermsOfService from "./TermsOfService";

import PrivacyPolicy from "./PrivacyPolicy";

import ContactSupport from "./ContactSupport";

import RefundPolicy from "./RefundPolicy";

import FAQ from "./FAQ";

import GroupDetails from "./GroupDetails";

import ClassDetails from "./ClassDetails";

import CreateClass from "./CreateClass";

import RecipeDetails from "./RecipeDetails";

import DevLogin from "./DevLogin";

import Membership from "./Membership";

import CookVerification from "./CookVerification";

import PostDishForm from "./PostDishForm";

import PostRecipeForm from "./PostRecipeForm";

import PostClassForm from "./PostClassForm";

import CookApplication from "./CookApplication";

import CookOnboarding from "./CookOnboarding";

import PaymentCheckout from "./PaymentCheckout";

import dd_Community from "./dd_Community";

import dd_BulkUpload from "./dd_BulkUpload";

import OrderConfirmation from "./OrderConfirmation";

import CurrencySettings from "./CurrencySettings";

import OrderHistory from "./OrderHistory";

import MealPrep from "./MealPrep";

import DeliveryServices from "./DeliveryServices";

import FreeFood from "./FreeFood";

import Giveaways from "./Giveaways";

import LastCallEats from "./LastCallEats";

import SurplusGroceries from "./SurplusGroceries";

import MealPrepDetails from "./MealPrepDetails";

import LastCallEatDetails from "./LastCallEatDetails";

import GiveawayDetails from "./GiveawayDetails";

import SurplusGroceryDetails from "./SurplusGroceryDetails";

import ReferralSystem from "./ReferralSystem";

import RedeemCode from "./RedeemCode";

import Credits from "./Credits";

import FixMe_List from "./FixMe_List";

import ReleaseNotes_v1 from "./ReleaseNotes_v1";

import DD2_Homepage from "./DD2_Homepage";

import PostMealPrepForm from "./PostMealPrepForm";

import PostLastCallForm from "./PostLastCallForm";

import PostSurplusGroceryForm from "./PostSurplusGroceryForm";

import PostGiveawayForm from "./PostGiveawayForm";

import ChefsMarketplace from "./ChefsMarketplace";

import LeftoversMarket from "./LeftoversMarket";

import ProfilesGallery from "./ProfilesGallery";

import ProfileDetails from "./ProfileDetails";

import EditMyProfile from "./EditMyProfile";

import MapListings from "./MapListings";

import Leaderboard from "./Leaderboard";

import BulkUpload from "./BulkUpload";

import Restaurants from "./Restaurants";

import RestaurantDetails from "./RestaurantDetails";

import AccountSettings from "./AccountSettings";

import PrivacySettings from "./PrivacySettings";

import BlockedUsers from "./BlockedUsers";

import MockCheckout from "./MockCheckout";

import MockOrderTracking from "./MockOrderTracking";

import MockDeliveryMap from "./MockDeliveryMap";

import MockOrderHistory from "./MockOrderHistory";

import Gamification from "./Gamification";

import EnhancedCheckout from "./EnhancedCheckout";

import OrderRating from "./OrderRating";

import MVPHome from "./MVPHome";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    DishDetails: DishDetails,
    
    PostDish: PostDish,
    
    Checkout: Checkout,
    
    OrderTracking: OrderTracking,
    
    Search: Search,
    
    Cart: Cart,
    
    Profile: Profile,
    
    AddAddress: AddAddress,
    
    Chat: Chat,
    
    SchedulePost: SchedulePost,
    
    Notifications: Notifications,
    
    SpecialOffers: SpecialOffers,
    
    Settings: Settings,
    
    Help: Help,
    
    Onboarding: Onboarding,
    
    EditProfile: EditProfile,
    
    OrderDetails: OrderDetails,
    
    ReportIssue: ReportIssue,
    
    PaymentMethod: PaymentMethod,
    
    NotificationSettings: NotificationSettings,
    
    SavedAddresses: SavedAddresses,
    
    Reviews: Reviews,
    
    LanguageSettings: LanguageSettings,
    
    MyDishes: MyDishes,
    
    EarningsPayouts: EarningsPayouts,
    
    DietaryPreferences: DietaryPreferences,
    
    FavoriteCooks: FavoriteCooks,
    
    ReportCook: ReportCook,
    
    SavedDishes: SavedDishes,
    
    Categories: Categories,
    
    Activity: Activity,
    
    BuyerProfile: BuyerProfile,
    
    CookProfile: CookProfile,
    
    Ingredients: Ingredients,
    
    CookingClasses: CookingClasses,
    
    MealPlanning: MealPlanning,
    
    Community: Community,
    
    Gifting: Gifting,
    
    Recipes: Recipes,
    
    FreeMeals: FreeMeals,
    
    OrderReview: OrderReview,
    
    MyReviews: MyReviews,
    
    Messages: Messages,
    
    CookDashboard: CookDashboard,
    
    TermsOfService: TermsOfService,
    
    PrivacyPolicy: PrivacyPolicy,
    
    ContactSupport: ContactSupport,
    
    RefundPolicy: RefundPolicy,
    
    FAQ: FAQ,
    
    GroupDetails: GroupDetails,
    
    ClassDetails: ClassDetails,
    
    CreateClass: CreateClass,
    
    RecipeDetails: RecipeDetails,
    
    DevLogin: DevLogin,
    
    Membership: Membership,
    
    CookVerification: CookVerification,
    
    PostDishForm: PostDishForm,
    
    PostRecipeForm: PostRecipeForm,
    
    PostClassForm: PostClassForm,
    
    CookApplication: CookApplication,
    
    CookOnboarding: CookOnboarding,
    
    PaymentCheckout: PaymentCheckout,
    
    dd_Community: dd_Community,
    
    dd_BulkUpload: dd_BulkUpload,
    
    OrderConfirmation: OrderConfirmation,
    
    CurrencySettings: CurrencySettings,
    
    OrderHistory: OrderHistory,
    
    MealPrep: MealPrep,
    
    DeliveryServices: DeliveryServices,
    
    FreeFood: FreeFood,
    
    Giveaways: Giveaways,
    
    LastCallEats: LastCallEats,
    
    SurplusGroceries: SurplusGroceries,
    
    MealPrepDetails: MealPrepDetails,
    
    LastCallEatDetails: LastCallEatDetails,
    
    GiveawayDetails: GiveawayDetails,
    
    SurplusGroceryDetails: SurplusGroceryDetails,
    
    ReferralSystem: ReferralSystem,
    
    RedeemCode: RedeemCode,
    
    Credits: Credits,
    
    FixMe_List: FixMe_List,
    
    ReleaseNotes_v1: ReleaseNotes_v1,
    
    DD2_Homepage: DD2_Homepage,
    
    PostMealPrepForm: PostMealPrepForm,
    
    PostLastCallForm: PostLastCallForm,
    
    PostSurplusGroceryForm: PostSurplusGroceryForm,
    
    PostGiveawayForm: PostGiveawayForm,
    
    ChefsMarketplace: ChefsMarketplace,
    
    LeftoversMarket: LeftoversMarket,
    
    ProfilesGallery: ProfilesGallery,
    
    ProfileDetails: ProfileDetails,
    
    EditMyProfile: EditMyProfile,
    
    MapListings: MapListings,
    
    Leaderboard: Leaderboard,
    
    BulkUpload: BulkUpload,
    
    Restaurants: Restaurants,
    
    RestaurantDetails: RestaurantDetails,
    
    AccountSettings: AccountSettings,
    
    PrivacySettings: PrivacySettings,
    
    BlockedUsers: BlockedUsers,
    
    MockCheckout: MockCheckout,
    
    MockOrderTracking: MockOrderTracking,
    
    MockDeliveryMap: MockDeliveryMap,
    
    MockOrderHistory: MockOrderHistory,
    
    Gamification: Gamification,
    
    EnhancedCheckout: EnhancedCheckout,
    
    OrderRating: OrderRating,
    
    MVPHome: MVPHome,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/DishDetails" element={<DishDetails />} />
                
                <Route path="/PostDish" element={<PostDish />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/OrderTracking" element={<OrderTracking />} />
                
                <Route path="/Search" element={<Search />} />
                
                <Route path="/Cart" element={<Cart />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/AddAddress" element={<AddAddress />} />
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/SchedulePost" element={<SchedulePost />} />
                
                <Route path="/Notifications" element={<Notifications />} />
                
                <Route path="/SpecialOffers" element={<SpecialOffers />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Help" element={<Help />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/EditProfile" element={<EditProfile />} />
                
                <Route path="/OrderDetails" element={<OrderDetails />} />
                
                <Route path="/ReportIssue" element={<ReportIssue />} />
                
                <Route path="/PaymentMethod" element={<PaymentMethod />} />
                
                <Route path="/NotificationSettings" element={<NotificationSettings />} />
                
                <Route path="/SavedAddresses" element={<SavedAddresses />} />
                
                <Route path="/Reviews" element={<Reviews />} />
                
                <Route path="/LanguageSettings" element={<LanguageSettings />} />
                
                <Route path="/MyDishes" element={<MyDishes />} />
                
                <Route path="/EarningsPayouts" element={<EarningsPayouts />} />
                
                <Route path="/DietaryPreferences" element={<DietaryPreferences />} />
                
                <Route path="/FavoriteCooks" element={<FavoriteCooks />} />
                
                <Route path="/ReportCook" element={<ReportCook />} />
                
                <Route path="/SavedDishes" element={<SavedDishes />} />
                
                <Route path="/Categories" element={<Categories />} />
                
                <Route path="/Activity" element={<Activity />} />
                
                <Route path="/BuyerProfile" element={<BuyerProfile />} />
                
                <Route path="/CookProfile" element={<CookProfile />} />
                
                <Route path="/Ingredients" element={<Ingredients />} />
                
                <Route path="/CookingClasses" element={<CookingClasses />} />
                
                <Route path="/MealPlanning" element={<MealPlanning />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Gifting" element={<Gifting />} />
                
                <Route path="/Recipes" element={<Recipes />} />
                
                <Route path="/FreeMeals" element={<FreeMeals />} />
                
                <Route path="/OrderReview" element={<OrderReview />} />
                
                <Route path="/MyReviews" element={<MyReviews />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/CookDashboard" element={<CookDashboard />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/ContactSupport" element={<ContactSupport />} />
                
                <Route path="/RefundPolicy" element={<RefundPolicy />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/GroupDetails" element={<GroupDetails />} />
                
                <Route path="/ClassDetails" element={<ClassDetails />} />
                
                <Route path="/CreateClass" element={<CreateClass />} />
                
                <Route path="/RecipeDetails" element={<RecipeDetails />} />
                
                <Route path="/DevLogin" element={<DevLogin />} />
                
                <Route path="/Membership" element={<Membership />} />
                
                <Route path="/CookVerification" element={<CookVerification />} />
                
                <Route path="/PostDishForm" element={<PostDishForm />} />
                
                <Route path="/PostRecipeForm" element={<PostRecipeForm />} />
                
                <Route path="/PostClassForm" element={<PostClassForm />} />
                
                <Route path="/CookApplication" element={<CookApplication />} />
                
                <Route path="/CookOnboarding" element={<CookOnboarding />} />
                
                <Route path="/PaymentCheckout" element={<PaymentCheckout />} />
                
                <Route path="/dd_Community" element={<dd_Community />} />
                
                <Route path="/dd_BulkUpload" element={<dd_BulkUpload />} />
                
                <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
                
                <Route path="/CurrencySettings" element={<CurrencySettings />} />
                
                <Route path="/OrderHistory" element={<OrderHistory />} />
                
                <Route path="/MealPrep" element={<MealPrep />} />
                
                <Route path="/DeliveryServices" element={<DeliveryServices />} />
                
                <Route path="/FreeFood" element={<FreeFood />} />
                
                <Route path="/Giveaways" element={<Giveaways />} />
                
                <Route path="/LastCallEats" element={<LastCallEats />} />
                
                <Route path="/SurplusGroceries" element={<SurplusGroceries />} />
                
                <Route path="/MealPrepDetails" element={<MealPrepDetails />} />
                
                <Route path="/LastCallEatDetails" element={<LastCallEatDetails />} />
                
                <Route path="/GiveawayDetails" element={<GiveawayDetails />} />
                
                <Route path="/SurplusGroceryDetails" element={<SurplusGroceryDetails />} />
                
                <Route path="/ReferralSystem" element={<ReferralSystem />} />
                
                <Route path="/RedeemCode" element={<RedeemCode />} />
                
                <Route path="/Credits" element={<Credits />} />
                
                <Route path="/FixMe_List" element={<FixMe_List />} />
                
                <Route path="/ReleaseNotes_v1" element={<ReleaseNotes_v1 />} />
                
                <Route path="/DD2_Homepage" element={<DD2_Homepage />} />
                
                <Route path="/PostMealPrepForm" element={<PostMealPrepForm />} />
                
                <Route path="/PostLastCallForm" element={<PostLastCallForm />} />
                
                <Route path="/PostSurplusGroceryForm" element={<PostSurplusGroceryForm />} />
                
                <Route path="/PostGiveawayForm" element={<PostGiveawayForm />} />
                
                <Route path="/ChefsMarketplace" element={<ChefsMarketplace />} />
                
                <Route path="/LeftoversMarket" element={<LeftoversMarket />} />
                
                <Route path="/ProfilesGallery" element={<ProfilesGallery />} />
                
                <Route path="/ProfileDetails" element={<ProfileDetails />} />
                
                <Route path="/EditMyProfile" element={<EditMyProfile />} />
                
                <Route path="/MapListings" element={<MapListings />} />
                
                <Route path="/Leaderboard" element={<Leaderboard />} />
                
                <Route path="/BulkUpload" element={<BulkUpload />} />
                
                <Route path="/Restaurants" element={<Restaurants />} />
                
                <Route path="/RestaurantDetails" element={<RestaurantDetails />} />
                
                <Route path="/AccountSettings" element={<AccountSettings />} />
                
                <Route path="/PrivacySettings" element={<PrivacySettings />} />
                
                <Route path="/BlockedUsers" element={<BlockedUsers />} />
                
                <Route path="/MockCheckout" element={<MockCheckout />} />
                
                <Route path="/MockOrderTracking" element={<MockOrderTracking />} />
                
                <Route path="/MockDeliveryMap" element={<MockDeliveryMap />} />
                
                <Route path="/MockOrderHistory" element={<MockOrderHistory />} />
                
                <Route path="/Gamification" element={<Gamification />} />
                
                <Route path="/EnhancedCheckout" element={<EnhancedCheckout />} />
                
                <Route path="/OrderRating" element={<OrderRating />} />
                
                <Route path="/MVPHome" element={<MVPHome />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}