import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-10">Sign Up</h1>
      <form className="flex flex-col gap-5">
        <input
          type="text"
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg outline-0 bg-white"
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg outline-0 bg-white"
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg outline-0 bg-white"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 cursor-pointer disabled:opacity-80"
        >
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-sky-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
