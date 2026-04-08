SELECT
  c.nome_cliente,
  c.email
FROM d_clientes c
  WHERE EXISTS (
  SELECT 1
  FROM d_pedidos p1
  WHERE p1.id_cliente = c.id_cliente
    AND UPPER(p1.status) LIKE 'CONCLUI%'
)
AND NOT EXISTS (
  SELECT 1
  FROM d_pedidos p2
  WHERE p2.id_cliente = c.id_cliente
    AND p2.data >= (CURRENT_DATE - INTERVAL '90' DAY)
)
ORDER BY c.nome_cliente;
