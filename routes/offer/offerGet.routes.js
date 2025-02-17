const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const Offer = require("../../models/Offer");
const User = require("../../models/User");

router.get("/offers", async (req, res) => {
  console.log("je suis sur la route /offers");
  let { title, priceMin, priceMax, sort, page } = req.query;
  console.log(
    "req.query.title:",
    req.query.title,
    "\n",
    "req.query.priceMin:",
    req.query.priceMin,
    "\n",
    "req.query.priceMax:",
    req.query.priceMax,
    "\n",
    "req.query.sort:",
    req.query.sort
  );
  let ownerFind;
  let filter = {};
  let select = "";
  let skipNum = 0;
  let filterSort = {};
  let limitNum = 0;
  priceMin = Number(req.query.priceMin);
  priceMax = req.query.priceMax ? Number(req.query.priceMax) : 100000;
  try {
    if (
      req.query.title ||
      req.query.priceMin ||
      req.query.priceMax ||
      req.query.sort !== undefined
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
        console.log("typeof priceMin:", typeof priceMin);
        filter.product_price = {
          ...filter.product_price,
          $gte: priceMin,
        };
        console.log("filter.product_price priceMin:", filter.product_price);
      }
      if (priceMax !== undefined) {
        filter.product_price = {
          ...filter.product_price,
          $lte: priceMax,
        };
        console.log(
          "filter.product_price priceMax:",
          filter.product_price,
          "\n",
          "typeof priceMax:",
          typeof priceMax
        );
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
        let limitNum = 3;
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
        .skip(skipNum);
      // .select(select);
      // console.log("offers in /offers:", offers);
      const offersWithOwner = await Promise.all(
        offers.map(async (offer) => {
          const owner = await User.findById(offer.owner).select("account");
          return {
            ...offer._doc,
            owner,
          };
        })
      );

      return res.status(200).json(offersWithOwner);
    } else {
      // console.log("ok");
      const newOffers = await Offer.find();
      // console.log("offers in /offers:", offers);
      let offers = [];
      // const getOffer = await Offer.find().select("product_name product_price -_id");
      // console.log("newOffers in /offers:", newOffers);
      for (let i = 0; i < newOffers.length; i++) {
        const el = newOffers[i];
        // console.log("el:", el);
        const userId = el.owner;
        // console.log("userId in /offers:", userId);
        // console.log("typeof userId in /offers:", typeof userId);
        // const userIdIsValid = mongoose.isValidObjectId(userId);
        // console.log("userIdIsValid in /offers:", userIdIsValid);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind in for in /offers:", ownerFind);
        offers.push({
          _id: el._id,
          product_name: el.product_name,
          product_description: el.product_description,
          product_price: el.product_price,
          product_details: el.product_details,
          product_image: el.product_image,
          product_pictures: el.product_pictures,
          offer_solded: el.offer_solded,
          owner: ownerFind,
        });
      }
      // console.log("offers in /offers:", offers);
      return res.status(200).json(offers);
    }
  } catch (error) {
    console.log("error:", error, "\n", "error.message:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
