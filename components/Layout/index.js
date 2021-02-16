export default function Layout({ children }) {
  return (
    <div className="md:container md:mx-auto py-10 px-4">
      <div className="grid grid-cols-12">
        <div className="col-span-full lg:col-start-3 lg:col-span-8">
          {children}
        </div>
      </div>
    </div>
  );
}