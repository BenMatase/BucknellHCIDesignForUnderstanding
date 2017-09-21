library(ggplot2)

suicide_attacks = read.csv("~/HCI/suicide_attacks.csv")

for(i  in 1:nrow(suicide_attacks)) {
  sa_date = paste(suicide_attacks[i, "year"], suicide_attacks[i, "month"], suicide_attacks[i, "day"], sep="-")
  suicide_attacks[i, "date"] = as.Date(sa_date, "%Y-%m-%d")
}

country = as.character(levels(suicide_attacks$country))
count = rep(0, times=length(country))
df.country.count = data.frame(country, count)
df.country.count$country = as.character(df.country.count$country)

df = data.frame(matrix(0, ncol=3, nrow=0))
data.frame[,1] = as.character(data.frame[,1])
for(i in 1:nrow(suicide_attacks)) {
    country = as.character(suicide_attacks[i, "country"])
    country.row = which(df.country.count$country == as.character(country))
    country.count = df.country.count$count[country.row]
    country.count = country.count + suicide_attacks[i, "X..killed"]
    df.country.count[country.row,2] = country.count

    temp = data.frame(country, suicide_attacks[i, "date"], country.count)
    df = rbind(df, temp)
}
df = setNames(df, c("country", "date", "sum"))

n = 5
#get top n
top.countries = df.country.count[order(df.country.count$count, decreasing=T),][1:n,1]

subsetted.df = subset(df, country %in% top.countries)

ggplot(data=subsetted.df, aes(x=date, y=sum, colour=country)) +
  geom_line() +
  scale_x_date()
