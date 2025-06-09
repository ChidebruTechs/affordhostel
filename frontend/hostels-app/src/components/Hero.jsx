export default function Hero() {
  return (
    <div className="w-screen h-screen pt-10 bg-gray-100">
      <div
        className="m-auto text-center flex flex-col items-center justify-center text-white h-3/5 w-4/5
        rounded-2xl bg-center bg-cover bg-no-repeat px-6
        bg-[linear-gradient(rgba(106,27,154,0.9),rgba(38,166,154,0.8)),url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')]"
      >
        <h1 className="text-4xl font-serif md:text-5xl font-extrabold leading-tight mb-4">
          Simplify Off-Campus Hostel Booking in Kenya
        </h1>
        <p className="text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
          Find affordable, comfortable, and secure hostels near your university<br />
          campus with our easy-to-use platform
        </p>
        <button className="bg-tealOverlay text-white px-6 py-2 rounded-md text-base font-medium hover:bg-opacity-90 transition">
          Browse Hostels
        </button>
      </div>
    </div>
  );
}
