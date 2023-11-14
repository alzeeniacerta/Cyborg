export const elements = {
	dashboardName: "(//span[@aria-label='List'])[2]/ancestor::button/preceding-sibling::span",
	dashboardButton: "//a[@href='/dashboards']",
	dashboardList: "//div[@aria-label='Dashboards']",
	reportNames: "//div[contains(@class,'report-paper')]/div[1]/div[1]/span[1]/div/span",
	rearrangeButton: "(//div[@id='report-arrangement-controls']/div/button)[index]",

	reportData: "(//div[contains(@class,'report-paper')])[index]/..//tbody[@class='ant-table-tbody']/tr[2]/td",
	viewLogDiv: "((//ul[starts-with(@class,'ant-timeline')])[2]/li/div[3])",
	significantEventLogDiv: "((//ul[starts-with(@class,'ant-timeline')])[1]/li/div[3])",
	emailLogDiv: "((//ul[starts-with(@class,'ant-timeline')])[4]/li/div[3])",
	editsLogDiv: "((//ul[starts-with(@class,'ant-timeline')])[3]/li/div[3])",
	// Basic filters
	processTypeFilter: "//div[contains(text(),'Enter report type')]",
	containsFilter: "//input[@aria-label='Contains']",
	statusFilter: "//div[contains(text(),'Enter report status')]",

	addToWishlistButton: "(//span[@aria-label='HeartUnfilled'])[index]",
	removeFromWishlistButton: "(//span[@aria-label='HeartFilled'])[index]",
};
