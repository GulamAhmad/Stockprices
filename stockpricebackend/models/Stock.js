module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define("Stock", {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    refreshInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Stock;
};
