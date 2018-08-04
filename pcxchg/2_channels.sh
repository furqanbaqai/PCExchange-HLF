docker exec -it cli.Amazon bash -c 'peer channel create -c asus -f ./channels/Asus.tx -o orderer.pcxchg.com:7050'
docker exec -it cli.Amazon bash -c 'peer channel create -c dell -f ./channels/Dell.tx -o orderer.pcxchg.com:7050'
docker exec -it cli.Amazon bash -c 'peer channel create -c hp -f ./channels/HP.tx -o orderer.pcxchg.com:7050'

docker exec -it cli.Amazon bash -c 'peer channel join -b asus.block'
docker exec -it cli.Amazon bash -c 'peer channel join -b dell.block'
docker exec -it cli.Amazon bash -c 'peer channel join -b hp.block'

docker exec cli.Asus bash -c 'peer channel join -b asus.block'
docker exec cli.HP bash -c 'peer channel join -b hp.block'
docker exec cli.Dell bash -c 'peer channel join -b dell.block'

docker exec cli.Asus bash -c 'peer channel update -o orderer.pcxchg.com:7050 -c asus -f ./channels/asusanchor.tx'
docker exec cli.Dell bash -c 'peer channel update -o orderer.pcxchg.com:7050 -c dell -f ./channels/dellanchor.tx'
docker exec cli.HP bash -c 'peer channel update -o orderer.pcxchg.com:7050 -c hp -f ./channels/hpanchor.tx'
docker exec cli.Amazon bash -c 'peer channel update -o orderer.pcxchg.com:7050 -c asus -f ./channels/amazonanchorasus.tx'
docker exec cli.Amazon bash -c 'peer channel update -o orderer.pcxchg.com:7050 -c dell -f ./channels/amazonanchordell.tx'
docker exec cli.Amazon bash -c 'peer channel update -o orderer.pcxchg.com:7050 -c hp -f ./channels/amazonanchorhp.tx'
