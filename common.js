//#region Hamburger Menu
document.addEventListener("DOMContentLoaded", () => {

	const leftHamMenuButton = document.getElementById("left-hamMenu-button"),
		leftHamMenuBack = document.getElementById("left-hamMenu-back"),
		rightHamMenuButton = document.getElementById("right-hamMenu-button"),
		rightHamMenuBack = document.getElementById("right-hamMenu-back"),
		HamMenu = document.getElementById("hamMenu");

	function menuClick() {
		this.classList.toggle("active");
		((this === leftHamMenuButton) ? leftHamMenuBack : rightHamMenuBack).classList.toggle("active");
		HamMenu.classList.toggle("showing");
	}

	leftHamMenuButton.addEventListener("click", menuClick);

	rightHamMenuButton.addEventListener("click", menuClick);

	(function () {
		const height = 56;
		let offset = 0,
			lastPosition = 0,
			ticking = false;

		function onScroll() {
			if (lastPosition > height) {
				if (lastPosition > offset) {
					leftHamMenuButton.classList.add("left-disappear-animation");
					rightHamMenuButton.classList.add("right-disappear-animation");
					leftHamMenuBack.classList.add("left-disappear-animation");
					rightHamMenuBack.classList.add("right-disappear-animation");
					console.log("disappear!");
				} else {
					leftHamMenuButton.classList.remove("left-disappear-animation");
					rightHamMenuButton.classList.remove("right-disappear-animation");
					leftHamMenuBack.classList.remove("left-disappear-animation");
					rightHamMenuBack.classList.remove("right-disappear-animation");
					console.log("appear!");
				}
				offset = lastPosition;
			}
		}

		window.addEventListener('scroll', function () {
			lastPosition = window.scrollY;

			if (!ticking) {
				window.requestAnimationFrame(function () {
					onScroll(lastPosition);
					ticking = false;
				});
				ticking = true;
			}
		});
	})();



});

//#endregion
//#region Page Loader

document.addEventListener("DOMContentLoaded", loadPage);

// specific functions

/**
 * @param {HashChangeEvent|undefined} ev 
 */
function loadPage(ev) {
	const pageID = getURLQuery()["page"];
	console.groupCollapsed(`page loading`);
	console.log(`query == '${pageID}'`);

	if (!pageID) {
		console.log("loading landing page");
		loadArticle("pages/landing/article.html", "KSS PC Club / Menu");

	} else if (pageID == "404") {
		show404();

	} else if (pageID.startsWith("works-")) {
		const tmp = pageID.split("-");
		tmp.shift();
		const workID = tmp.join("-");
		console.log(`loading works page associated to '${workID}'`);
		loadArticle("pages/works/" + workID + ".html", loadWorksTitles(workID));

	} else {
		show404();
	}
	console.groupEnd();
}
const loadWorksTitles = (() => {
	let map = undefined;
	const promise = fetch("pages/works/index.json")
		.then(res => res.json())
		.then(json => {
			map = json;
		});
	return (workID) => {
		const getTitle = () => map[workID] && map[workID].title ? "KSS PC club / " + map[workID].title : undefined;
		if (map) return Promise.resolve(getTitle());
		else return promise.then(() => getTitle());
	}
})();
function loadArticle(url, title) {
	return fetch(url)
		.then(res => {
			if (res.ok) {
				return res.text();
			} else {
				throw res.statusText;
			}
		})
		.then(html => showArticle(html, getBaseURL(url), title))
		.catch(err => {
			console.error(err);
			show404();
		})
}
function show404() {
	return loadArticle("pages/404/article.html", "KSS PC club / Not found");
}
/**
 * @param {string} html 
 * @param {string} baseURL 
 * @param {string|Promise<string>} title 
 */
function showArticle(html, baseURL, title) {

	// Set Contents

	/** @param {HTMLElement} elem */
	const modifier = elem => elem.childNodes.forEach(child => {
		const tag = child.tagName;
		if (!tag) return; // text node
		if (tag == "script") {
			const newElem = cloneHTMLElem(child); // これをしないとスクリプトが再度読み込みされないみたいなので。
			elem.replaceChild(newElem, child);
			child = newElem; // 次の処理のために。
		}
		const transAttrURL = attr => {
			if (!child.getAttribute) return;
			const attrValue = child.getAttribute(attr);
			if (!attrValue) return;
			child.setAttribute(attr, transURL(attrValue, baseURL));
		}
		transAttrURL("href");
		transAttrURL("src");

		modifier(child);
	});

	const div = document.createElement("div");
	div.innerHTML = html;
	modifier(div);

	const container = document.getElementById("main-contents");
	container.innerHTML = "";
	div.childNodes.forEach(_ => container.appendChild(_));

	// Set Title
	const setTitle = title => {
		if (title === undefined) {
			console.warn("Page title was not provided.");
			title = "KSS PC club";
		}
		document.title = title;
	};
	if (typeof title == "string" || typeof title == "undefined") {
		setTitle(title);
	} else { // title is a Promise
		title.then(setTitle);
	}
}

// generic functions

/** 
 * @param {HTMLElement} node
 * @returns {HTMLElement}
 */
function cloneHTMLElem(node) {
	const tag = node.tagName;
	const newElem = document.createElement(tag);
	for (let i = 0; i < child.attributes.length; i++) {
		const attr = child.attributes.item(i);
		newElem.setAttribute(attr.nodeName, attr.nodeValue);
	}
	newElem.innerHTML = child.innerHTML;
}
/**
 * @param {string} url 
 * @param {string} baseURL 
 */
function transURL(url, baseURL) {
	if (!baseURL.endsWith("/")) {
		console.warn("baseURLは、末尾に'/'がついていてほしい", "baseURL: " + baseURL);
		baseURL += "/";
	}

	if (url.indexOf(":") >= 0) return url; // absolute path
	if (url.startsWith("#")) return url; // hash
	if (url.startsWith("/")) return "/CulFes2019" + url; // absolute path
	return baseURL + url;
}
/**
 * https://hoge.com/fuga/hhu/piyo.html -> https://hoge.com/fuga/hhu/
 * @param {string} url 
 */
function getBaseURL(url) {
	if (url.endsWith("/")) return url;
	const frag = url.split("/");
	frag.pop();// filename
	return frag.join("/") + "/";
}
function getURLQuery() {
	let arg = {};
	let pair = location.search.substring(1).split('&');
	pair.forEach((V) => {
		let kv = V.split('=');
		arg[kv[0]] = kv[1];
	});
	return arg;
}

//#endregion

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("global-header").addEventListener("click", () => {
		location = "/CulFes2019";
	});
});