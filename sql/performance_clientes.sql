SELECT
    c.id_cliente,
    c.nome_cliente,
    CAST(COALESCE(SUM(CASE
        WHEN UPPER(p.status) LIKE 'CONCLUI%' THEN p.valor
        ELSE 0
    END), 0) AS DECIMAL(15,2)) AS total_gasto,
    COALESCE(CAST(MAX(p.data) AS VARCHAR(10)), 'Sem pedidos') AS data_ultima_compra
FROM d_clientes c
LEFT JOIN d_pedidos p ON c.id_cliente = p.id_cliente
GROUP BY c.id_cliente, c.nome_cliente
ORDER BY total_gasto DESC;
