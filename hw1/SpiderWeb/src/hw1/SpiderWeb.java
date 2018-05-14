package hw1;

import java.io.IOException;
import java.util.LinkedList;

import org.jsoup.HttpStatusException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class SpiderWeb {
	private String root;
	private int n; 
	private int timeout;

	public static void main(String[] args) {
		try {
//			SpiderWeb web = new SpiderWeb("https://en.wikipedia.org/wiki/Kitten", 500, 2147483647);
			SpiderWeb web = new SpiderWeb(args[0],Integer.parseInt(args[1]),Integer.parseInt(args[2]));
			web.crawlWeb();
		} catch (Exception e) {
			System.out.println("I am Error");
			e.printStackTrace();
		}
	}

	public SpiderWeb(String root, int n, int timeout) {
		this.root = root;
		this.n = n;
		this.timeout = timeout;
	}
	
	public void crawlWeb() {
		LinkedList<String> urls = new LinkedList<String>();
		int i = 0;
		try {
			Document doc = Jsoup.connect(root).timeout(timeout).followRedirects(true).get();
			urls = getUrls(doc.select("a[href]"), new LinkedList<String>());

			while (urls.size()<n && i < urls.size()) {
				try {
					//System.out.println("/////Crawling link " + i + " ////// " + urls.size() + " / " + n);
					Document temp = Jsoup.connect(urls.get(i)).timeout(timeout).followRedirects(true).get();
					urls = getUrls(temp.select("a[href]"), urls);
				} catch (HttpStatusException e) {
					//System.out.println("Http Status Exception " + e.getStatusCode() + " on link #" + i + " -> " + urls.get(i));
				}
				i++;
			}
			printNSort(urls);
		} catch (IOException e) {
			System.out.println("Timed out before finging all " + n + " links. Only found " + urls.size() + " links.");
			System.out.println();
			printNSort(urls);
		}
	}

	private void printNSort(LinkedList<String> urls) {
		java.util.Collections.sort(urls);
		printUrls(urls);
	}

	private void printUrls(LinkedList<String> urls) {
		for (int i = 0; i < urls.size(); i++) {
			String url = urls.get(i);
			if (url.indexOf("?") > 0) {
				String querry = url.substring(url.indexOf("?") + 1);
				url = url.substring(0, url.indexOf("?"));
				System.out.println(url);
				printQuerryUrl(querry);
			} else {
				System.out.println(url);
			}
		}
	}

	private void printQuerryUrl(String querry) {
		while (querry.indexOf("&") > 0) {
			String temp = querry.substring(0, querry.indexOf("&"));
			printQuerry(temp);
			querry = querry.substring(querry.indexOf("&") + 1);
		}
		printQuerry(querry);
	}

	private void printQuerry(String que) {
		System.out.println("\t" + que.substring(0, que.indexOf("=")) + ": " + que.substring(que.indexOf("=") + 1));
	}

	private LinkedList<String> getUrls(Elements anchors, LinkedList<String> urls) {
		for (Element element : anchors) {
			String temp = element.attr("href");			
			if (!temp.startsWith("javascript:void(0)") && temp.length() > 1 && urls.size() < n && !temp.startsWith("#")
					&& !temp.startsWith("tel:")) {
				if (!temp.startsWith("http")) {
					temp = root + temp;
				}
				if (!urls.contains(temp)) {
					urls.add(temp);
				}
			}
		}
		return urls;
	}
}
