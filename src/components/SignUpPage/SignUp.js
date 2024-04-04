"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import Header from "@/layouts/Header/Header";
import { useAuthUserAndSignOut } from "@/hooks/useAuthUserAndSignOut";
import createUser from "@/services/usersRequests/createUser";

import styles from "./SignUp.module.css";

const signUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  fname: Yup.string().required("Required"),
  lname: Yup.string().required("Required"),
  phone: Yup.string()
    .required("Required")
    .matches(
      /^(\+\d{1,3}[- ]?)?\d{9}$/,
      "Phone number must be 9 digits and may start with a country code"
    ),
  psw: Yup.string()
    .required('No password provided') 
    .matches(/[0-9]/, 'The password contains at least one number')
    .matches(/[a-z]/, 'The password contains at least one lowercase latin letter')
    .matches(/[A-Z]/, 'The password contains at least one uppercase latin letter;')
    .matches(/[!@#$%^&*]/, 'The password contains at least one special character')
    .min(6, 'Password should be at least 6 characters'),
  "psw-repeat": Yup.string()
    .oneOf([Yup.ref("psw"), null], "Passwords must match")
    .required("Required"),
});

const SignUp = () => {
  const { push } = useRouter();
  const { userSignUp } = useAuthUserAndSignOut();
  const formik = useFormik({
    initialValues: {
      email: "",
      fname: "",
      lname: "",
      phone: "",
      psw: "",
      "psw-repeat": "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      userSignUp(values)
        .then((userCredential) => {
          createUser(userCredential?.user?.uid, values)
            .then((data) => {
              push('/');
            })
            .catch((err) => console.log("createUser err", err));
        })
        .catch((err) => console.log(err));
    },
  });

  return (
    <>
      <Header />
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onSubmit={formik.handleSubmit}
        className={`${styles.signForm}`}
      >
        <div className={`${styles.container}`}>
          <p>Please fill in this form to create an account.</p>
          <hr className={`${styles.horizontalLine}`} />

          <label htmlFor="fname">
            <b>First Name</b>
          </label>
          <input
            id="fname"
            className={`${styles.input}`}
            type="text"
            placeholder="First Name"
            name="fname"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fname}
            required
          />
          {formik.touched.fname && formik.errors.fname && (
            <div className={`${styles.error}`}>{formik.errors.fname}</div>
          )}

          <label htmlFor="lname">
            <b>Last Name</b>
          </label>
          <input
            id="lname"
            className={`${styles.input}`}
            type="text"
            placeholder="Last Name"
            name="lname"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lname}
            required
          />
          {formik.touched.lname && formik.errors.lname && (
            <div className={`${styles.error}`}>{formik.errors.lname}</div>
          )}
          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            id="email"
            className={`${styles.input}`}
            type="email"
            placeholder="Email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            required
          />
          {formik.touched.email && formik.errors.email && (
            <div className={`${styles.error}`}>{formik.errors.email}</div>
          )}

          <label htmlFor="phone">
            <b>Phone Number</b>
          </label>
          <input
            id="phone"
            className={`${styles.input}`}
            type="text"
            placeholder="Phone Number"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            required
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className={`${styles.error}`}>{formik.errors.phone}</div>
          )}

          <label htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            id="psw"
            className={`${styles.input}`}
            type="password"
            placeholder="Password"
            name="psw"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.psw}
            required
          />
          {formik.touched.psw && formik.errors.psw && (
            <div className={`${styles.error}`}>{formik.errors.psw}</div>
          )}

          <label htmlFor="psw-repeat">
            <b>Repeat Password</b>
          </label>
          <input
            id="psw-repeat"
            className={`${styles.input}`}
            type="password"
            placeholder="Repeat Password"
            name="psw-repeat"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values["psw-repeat"]}
            required
          />
          {formik.touched["psw-repeat"] && formik.errors["psw-repeat"] && (
            <div className={`${styles.error}`}>
              {formik.errors["psw-repeat"]}
            </div>
          )}
        </div>
        <div className={`${styles.buttonContainer}`}>
          <button type="submit" className={`${styles.btn} ${styles.halfWidth}`}>
            Sign Up
          </button>
          <Link href="/login" className={`${styles.btn} ${styles.halfWidth}`}>
            Login
          </Link>
        </div>
      </motion.form>
    </>
  );
};

export default SignUp;
