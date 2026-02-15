const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-agri-green to-agri-green-light text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌾</span>
              <span className="text-lg font-bold">AgriTech</span>
            </div>
            <p className="text-sm font-medium">Smart farming for better harvest</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>Dashboard</li>
              <li>Crop Management</li>
              <li>Market Prices</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>Learning Center</li>
              <li>Government Schemes</li>
              <li>Community</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white border-opacity-20 pt-6 text-center">
          <p className="text-sm font-medium">&copy; 2026 AgriTech Platform. Built for farmers with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
