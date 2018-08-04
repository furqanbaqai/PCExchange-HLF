#!/bin/bash

docker exec cli.Asus bash -c 'peer chaincode install -p pcxchg -n pcxchg -v 0'
docker exec cli.HP bash -c 'peer chaincode install -p pcxchg -n pcxchg -v 0'
docker exec cli.Dell bash -c 'peer chaincode install -p pcxchg -n pcxchg -v 0'
docker exec cli.Amazon bash -c 'peer chaincode install -p pcxchg -n pcxchg -v 0'

docker exec cli.Asus bash -c "peer chaincode instantiate -C asus -n pcxchg -v 0 -c '{\"Args\":[]}'"
docker exec cli.HP bash -c "peer chaincode instantiate -C hp -n pcxchg -v 0 -c '{\"Args\":[]}'"
docker exec cli.Dell bash -c "peer chaincode instantiate -C dell -n pcxchg -v 0 -c '{\"Args\":[]}'"
