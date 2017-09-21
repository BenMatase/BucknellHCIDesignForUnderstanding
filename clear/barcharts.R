library(tidyverse)

suicide <- read_csv("suicide_attacks.csv")


groupedKilled <- suicide %>% group_by(country) %>% summarise(total_killed = sum(total_killed))
groupedKilledTop5 <- head(arrange(groupedKilled, desc(total_killed)),5)

plot <- groupedKilledTop5 %>% ggplot( aes (x = reorder(country, -total_killed), y = total_killed)) +
        geom_bar(stat = "identity") + 
        theme(axis.text.x=element_text(angle=90,hjust=1,vjust=0.5)) +
        labs(x = "Country", y = "Total Killed", title = "Top 5 Total Killed for each Country")  +
        theme(plot.title = element_text(hjust = 0.5))
print(plot)


counts_df <- count(suicide, country)
counts_top_5<- head(arrange(counts_df, desc(n)),5)
counts_top_5

plot <- counts_top_5 %>% ggplot( aes (x = reorder(country, -n), y = n)) +
        geom_bar(stat = "identity") + 
        theme(axis.text.x=element_text(angle=90,hjust=1,vjust=0.5)) +
        labs(x = "Country", y = "Total Attacks", title = "Top 5 Total Attacks for each Country")  +
        theme(plot.title = element_text(hjust = 0.5))
print(plot)


groupedAvg <- suicide %>% group_by(country) %>% summarise(total_killed = mean(total_killed))
groupedAvg <- head(arrange(groupedAvg, desc(total_killed)),5)
groupedAvg

plot <- groupedAvg %>% ggplot( aes (x = reorder(country, -total_killed), y = total_killed)) +
        geom_bar(stat = "identity") + 
        theme(axis.text.x=element_text(angle=90,hjust=1,vjust=0.5)) +
        labs(x = "Country", y = "Average Killed", title = "Top 5 Average Killed for each Country")  +
        theme(plot.title = element_text(hjust = 0.5))
plot
