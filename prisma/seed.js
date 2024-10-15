const prisma = require('../prisma');

const seed = async (
  numRestaurants = 3,
  numCustomers = 5,
  numReservations = 8
) => {
  const restaurants = Array.from({ length: numRestaurants }, (_, i) => ({
    name: `Restaurant ${i + 1}`,
  }));
  await prisma.restaurant.createMany({ data: restaurants });
  const customers = Array.from({ length: numCustomers }, (_, i) => ({
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@anything.com`,
  }));
  await prisma.customer.createMany({ data: customers });

  for (let i = 0; i < numReservations; i++) {
    // This sets the party size to a random number between 1 and 3
    const partySize = 1 + Math.floor(Math.random() * 3);

    // This creates and array of objects with random customer ids
    const party = Array.from({ length: partySize }, () => ({
      id: 1 + Math.floor(Math.random() * numCustomers),
    }));

    // This creates a new reservation with random if and connect to customers in party
    await prisma.reservation.create({
      data: {
        date: new Date(Date.now()).toDateString(),
        restaurantId: 1 + Math.floor(Math.random() * numRestaurants),
        party: { connect: party },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
