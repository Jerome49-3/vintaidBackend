const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const Offer = require("../../../models/Offer");
const User = require("../../../models/User");

router.get("/offers", async (req, res) => {
  console.log("je suis sur la route /offers");
  let { title, priceMin, priceMax, sort, page } = req.query;
  console.group("req.query on /offers");
  console.log(
    "title:",
    title,
    "\n",
    "priceMin:",
    priceMin,
    "\n",
    "priceMax:",
    priceMax,
    "\n",
    "sort:",
    sort,
    "\n",
    "page:",
    page
  );
  console.groupEnd();
  // let ownerFind;
  let filter = {};
  let select = "";
  let skipNum = 0;
  let filterSort = {};
  let limitNum = 0;
  priceMin = Number(req.query.priceMin);
  priceMax = req.query.priceMax ? Number(req.query.priceMax) : 100000;
  try {
    if (
      title !== "" ||
      priceMin !== 0 ||
      priceMax !== 100000 ||
      sort !== undefined ||
      page !== 1
    ) {
      // select = "product_name product_price -_id";
      // console.log('page:', page)
      if (
        title !== undefined ||
        priceMin !== undefined ||
        priceMax !== undefined ||
        sort === "price-desc" ||
        sort === "price-asc" ||
        page !== undefined ||
        page !== 0
      ) {
        filter.product_name = new RegExp(title, "i");
        // console.log("filter.product_name:", filter.product_name);
      }
      if (priceMin !== undefined) {
        // console.log("typeof priceMin:", typeof priceMin);
        filter.product_price = {
          ...filter.product_price,
          $gte: priceMin,
        };
        // console.log("filter.product_price priceMin:", filter.product_price);
      }
      if (priceMax !== undefined) {
        filter.product_price = {
          ...filter.product_price,
          $lte: priceMax,
        };
        // console.log(
        //   "filter.product_price priceMax:",
        //   filter.product_price,
        //   "\n",
        //   "typeof priceMax:",
        //   typeof priceMax
        // );
      }
      if (sort === "price-desc") {
        filterSort.product_price = -1;
        // console.log("price-desc:", filterSort);
      }
      if (sort === "price-asc") {
        filterSort.product_price = 1;
        // console.log("price-asc:", filterSort);
      }
      //si page est différend de undefined et strictement supérieur à 0
      if (page !== undefined || page !== 0) {
        let limitNum = 5;
        skipPage = page - 1;
        skipNum = skipPage * limitNum;
      }
      // console.log(
      //   "skipPage",
      //   skipPage,
      //   "skipNum:",
      //   skipNum,
      //   "limitNum:",
      //   limitNum
      // );
      const offers = await Offer.find(filter)
        .sort(filterSort)
        .limit(limitNum)
        .skip(skipNum)
        .select(select)
        .populate({
          path: "owner",
          select: "account",
        });
      // console.log("offers in /offers:", offers);
      const offersCounts = await Offer.where(filter).countDocuments();
      // console.log("offersCounts in /offers:", offersCounts);
      return res.status(200).json({ offers: offers, count: offersCounts });
    } else {
      console.log("ok");
      const offers = await Offer.find().populate({
        path: "owner",
        select: "account",
      });
      // console.log("offers in /offers:", offers);
      const offersCounts = await Offer.countDocuments();
      // console.log("offersCounts in /offers:", offersCounts);
      return res
        .status(200)
        .json({ offers: offers, items: limitNum, count: offersCounts });
    }
  } catch (error) {
    // console.log("error:", error, "\n", "error.message:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
