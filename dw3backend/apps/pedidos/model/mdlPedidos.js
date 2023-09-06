const db = require("../../../database/databaseconfig");

const getAllPedidos = async () => {
  return (
    await db.query(
      "SELECT *, (SELECT nome from clientes where clienteid = pedidos.clienteid)" +
        "FROM pedidos where deleted = false ORDER BY numero ASC"
    )
  ).rows;
};

const getPedidoByID = async (pedidoIDPar) => {
    return (
      await db.query(
        "SELECT *, (SELECT nome from clientes where clienteid = pedidos.clienteid)" +
          "FROM pedidos WHERE pedidoid = $1 and deleted = false ORDER BY numero ASC",
        [pedidoIDPar]
      )
    ).rows;
  };

const insertPedidos = async (pedidoREGPar) => {
  //@ Atenção: aqui já começamos a utilizar a variável msg para retornor erros de banco de dados.
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO pedidos " + "values(default, $1, $2, $3, $4, $5)",
        [
          pedidoREGPar.numero,
          pedidoREGPar.data,
          pedidoREGPar.valortotal,
          pedidoREGPar.clienteid,
          pedidoREGPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPedidos|insertPedidos] " + error.detail;
    linhasAfetadas = -1;
  }
  
  return { msg, linhasAfetadas };
};

const UpdatePedidos = async (pedidoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
          "UPDATE pedidos SET " +
            "numero = $2, " +
            "data = $3, " +
            "valortotal = $4, " +
            "clienteid = $5, " +
            "deleted = $6 " +
            "WHERE pedidoid = $1",
        [
          pedidoREGPar.pedidoid,
          pedidoREGPar.numero,
          pedidoREGPar.data,
          pedidoREGPar.valortotal,
          pedidoREGPar.clienteid,
          pedidoREGPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPedidos|UpdatePedidos] " + error.detail;
    linhasAfetadas = -1;
  }
  
  return { msg, linhasAfetadas };
};

  const DeletePedidos = async (pedidoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
      
    try {
      linhasAfetadas = (
      await db.query(
        "UPDATE pedidos SET " + "deleted = true " + "WHERE pedidoid = $1",
        [pedidoREGPar.pedidoid]
      )
    ).rowCount;
  } catch (error) {DeleteA
    msg = "[mdlPedidos|DeletePedidos] " + error.detail;
    linhasAfetadas = -1;
  }
  
  return { msg, linhasAfetadas };
  };

module.exports = {
    getAllPedidos,
    getPedidoByID,
    insertPedidos,
    UpdatePedidos,
    DeletePedidos
  };