const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
// Notice we use {} when importing `authenticate` because it is not the only export
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const customer = req.customer;
    const reservations = await prisma.reservation.findMany({
      where: { customerId: customer.id },
      include: { restaurant: true },
    });
    res.json(reservations);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { partySize, restaurantId } = req.body;
    const customer = req.customer;
    const reservation = await prisma.reservation.create({
      data: {
        partySize: + partySize,
        restaurantId: +restaurantId,
        customerId: customer.id,
      }
    });
    res.status(201).json(reservation);
  } catch (e) {
    next(e);
  }
});