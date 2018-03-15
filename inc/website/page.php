<?php
class Page {
	private $pageTitle = "";
	private $pageTemplate = null;
	private $pageContent = null;
	private $pageParameters = array();
	private $headerData = array(
		array(
			"link" => "index.php",
			"icon" => "folder-open-o",
			"text" => "HOME",
		),
	);

	private $startupScripts = array(
		array("jquery/jquery", true),
		array("jquery-ui/jquery-ui", true),
		array("basic", false),
	);

	private $startupCSS = array(
		array("w3css/w3", false),
		array("w3css/w3-theme", false),
		array("main", false),
		array("font-awesome/font-awesome", true),
	);

	private $pageHeaders = array();
	private $pageMetas = array();

	function __construct($title = "", $template, $parameters = array()) {
		if (is_string($title)) {
			$this->pageTitle = Loca::Get($title);
		}

		if (is_string($template)) {
			$this->pageTemplate = $template;
		}

		if (is_array($parameters)) {
			$this->Assign($parameters);
		}

		$this->pageHeaders = array(
			"Access-Control-Allow-Origin: https://".$_SERVER['HTTP_HOST'],
			"Content-Type: text/html; charset=UTF-8",
		);

		$this->pageMetas = array(
			'http-equiv="content-type" content="text/html;charset=utf-8"',
			'name="viewport" content="width=device-width, initial-scale=1"',
			'name="description" content="'.Loca::Get("CATCHPHRASE_META").'"',
		);

		return $this;
	}

	function AddHeader($header) {
		$this->pageHeaders[] = $header;
	}

	function AddMeta($meta) {
		$this->pageMetas[] = $meta;
	}

	function Assign($parameters, $paramVal = "") {
		if (is_array($parameters)) {
			foreach ($parameters as $name => $value) {
				$this->pageParameters[$name] = $value;
			}
		} elseif (is_string($parameters)) {
			$this->Assign(array($parameters => $paramVal));
		}
	}

	static function GetRoot() {
		$root = $_SERVER["DOCUMENT_ROOT"];

		if (self::IsLocal()) {
			return $root."/playscreen/";
		} else {
			return $root."/";
		}
	}

	function Draw($parameters = null, $rereturn = false) {
		$root = self::GetRoot();

		if (is_array($parameters)) {
			$this->Assign($parameters);
		}

		$engine = new Rain\RainTPL4();

		$engine->setConfiguration(array(
			"base_url"				=> null,
			"tpl_dir"				=> $root."tpl/",
			"cache_dir"				=> $root."tmp/",
			"debug"      			=> false,
			"ignore_unknown_tags"	=> true,
		));

		$engine->Assign($this->pageParameters);

		$engine->Assign(array(
			"home"	=> self::GetDomain(),
			"url"	=> self::GetURL(),
			"title"	=> $this->pageTitle." - ".Loca::Get("GLOBAL_PAGE_TITLE"),
			"meta"	=> $this->pageMetas,
		));

		if (is_string($this->pageContent)) {
			$content = $this->pageContent;
		} elseif (is_string($this->pageTemplate)) {
			$content = $engine->Draw($this->pageTemplate, true);

			if ($rereturn) {
				return $content;
			}
		} else {
			$content = "";
		}

		$header = new Rain\RainTPL4();

		$header->setConfiguration(array(
			"base_url"				=> null,
			"tpl_dir"				=> $root."tpl/",
			"cache_dir"				=> $root."tmp/",
			"debug"      			=> false,
			"ignore_unknown_tags"	=> true,
		));

		$header->Assign(array(
			"home"		=> self::GetDomain(),
			"url"		=> self::GetUrl(),
			"data"		=> $this->headerData,
		));

		$footer = new Rain\RainTPL4();

		$footer->setConfiguration(array(
			"base_url"				=> null,
			"tpl_dir"				=> $root."tpl/",
			"cache_dir"				=> $root."tmp/",
			"debug"      			=> false,
			"ignore_unknown_tags"	=> true,
		));

		$footer->Assign(array(
			"home"		=> self::GetDomain(),
			"url"		=> self::GetUrl(),
		));

		Loca::SpecificScripts($this);

		$engine->Assign(array(
			"scripts"	=> $this->startupScripts,
			"css"		=> $this->startupCSS,
			"header"	=> $header->Draw("website_header", true),
			"content"	=> $content,
			"footer"	=> $footer->Draw("website_footer", true),
		));

		foreach ($this->pageHeaders as $header) {
			header($header);
		}

		$engine->Draw("website_page");
	}

	function Mail($parameters = null) {
		$root = self::GetRoot();

		if (is_array($parameters)) {
			$this->Assign($parameters);
		}

		$engine = new Rain\RainTPL4();

		$engine->setConfiguration(array(
			"base_url"				=> null,
			"tpl_dir"				=> $root."tpl/",
			"cache_dir"				=> $root."tmp/",
			"debug"      			=> false,
			"ignore_unknown_tags"	=> true,
		));

		$engine->Assign($this->pageParameters);

		$engine->Assign(array(
			"home"	=> self::GetDomain(),
			"url"	=> self::GetURL(),
			"title"	=> $this->pageTitle." - ".Loca::Get("GLOBAL_PAGE_TITLE"),
			"meta"	=> $this->pageMetas,
		));

		if (is_string($this->pageContent)) {
			$content = $this->pageContent;
		} elseif (is_string($this->pageTemplate)) {
			$content = $engine->Draw($this->pageTemplate, true);
		} else {
			$content = "";
		}

		$page = new Rain\RainTPL4();

		$page->setConfiguration(array(
			"base_url"				=> null,
			"tpl_dir"				=> $root."tpl/",
			"cache_dir"				=> $root."tmp/",
			"debug"      			=> false,
			"ignore_unknown_tags"	=> true,
		));

		$page->Assign(array(
			"home"		=> self::GetDomain(),
			"url"		=> self::GetUrl(),
			"content"	=> $content,
		));

		return $page->Draw("mail_page", true);
	}

	static function GetVersion() {
		$file = fopen(self::GetRoot()."version.txt", "r");
		$version = fgets($file);
		fclose($file);
		$version = explode("-", $version);
		return $version[0].".".$version[1];
	}

	function AddScript($script = "", $min = false) {
		$this->startupScripts[] = array($script, $min);
	}

	function AddCSS($script = "", $min = false) {
		$this->startupCSS[] = array($script, $min);
	}

	static function IsLocal() {
		return $_SERVER['HTTP_HOST'] == "localhost";
	}

	static function GetDomain($forceSecure = false, $nosuffix = false) {
		if (self::IsLocal()) {
			$prefix = "";
			$suffix = "/playscreen";
		} else {
			$prefix = "";
			$suffix = "";
		}

		$https = @$_SERVER['HTTPS'];

		if ($forceSecure or (!empty($https) && $https !== 'off')) {
			$proto = "https://";
		} else {
			$proto = "http://";
		}

		$host = $_SERVER['HTTP_HOST'];

		if ($nosuffix) {
			return $proto.$host;
		} else {
			return $proto.$host.$suffix.'/';
		}
	}

	static function Reroute($target = "index.php") {
		$home = self::GetDomain();

		header("Location: ".$home.$target);
		die();
	}

	static function SendJSON($data = array()) {
		die(json_encode($data, JSON_NUMERIC_CHECK));
	}

	static function GetURL($forceSecure = false) {
		return self::getDomain($forceSecure, true).$_SERVER["REQUEST_URI"];
	}
}
