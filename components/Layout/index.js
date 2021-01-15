export default function Layout({ children }) {
  return (
    <div className="md:container md:mx-auto py-5 px-4">
      <div className="grid grid-cols-12">
        <div className="col-span-full md:col-start-3 md:col-span-8">
          {children}
        </div>
      </div>
    </div>
  );
}