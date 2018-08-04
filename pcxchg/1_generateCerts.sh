echo "***************** HLF-Network Config Creation *****************"
echo "---[Recycling directories and old configurations]"
# Recycling
rm -fr channels
rm -fr orderer
rm -fr crypto-config
# Create Respective directories
mkdir ./channels
mkdir ./orderer
echo "+++[Creating Certificates]"
# Create Cedrtificats
cryptogen generate --config ./crypto-config.yaml

echo "+++[Creating Genesis Block]"
# Create Genesis Block
configtxgen -profile PCXCHGOrdererGenesis -outputBlock ./orderer/genesis.block

echo "+++[Creating Channels Configurations]"
# Create Channel configurations
configtxgen -profile AsusChannel -outputCreateChannelTx ./channels/Asus.tx -channelID asus
configtxgen -profile DellChannel -outputCreateChannelTx ./channels/Dell.tx -channelID dell
configtxgen -profile HPChannel -outputCreateChannelTx ./channels/HP.tx -channelID hp

echo "+++[Creating Anchor Peers Confirations]"
# Create Anchor Peers
configtxgen -profile AsusChannel -outputAnchorPeersUpdate ./channels/asusanchor.tx -channelID asus -asOrg AsusMSP
configtxgen -profile DellChannel -outputAnchorPeersUpdate ./channels/dellanchor.tx -channelID dell -asOrg DellMSP
configtxgen -profile HPChannel -outputAnchorPeersUpdate ./channels/hpanchor.tx -channelID hp -asOrg HPMSP
configtxgen -profile AsusChannel -outputAnchorPeersUpdate ./channels/amazonanchorasus.tx -channelID asus -asOrg AmazonMSP
configtxgen -profile DellChannel -outputAnchorPeersUpdate ./channels/amazonanchordell.tx -channelID dell -asOrg AmazonMSP
configtxgen -profile HPChannel -outputAnchorPeersUpdate ./channels/amazonanchorhp.tx -channelID hp -asOrg AmazonMSP