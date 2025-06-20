
const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-6 px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-6">
            <span className="cursor-pointer hover:text-gray-700">Terms of Use</span>
            <span className="cursor-pointer hover:text-gray-700">Privacy</span>
            <span className="cursor-pointer hover:text-gray-700">Contact Us</span>
          </div>
          <div>
            ©2022-2025 Trinko, Inc.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
