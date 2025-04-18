# Pinterest Image Downloader Chrome Extension

<!-- Badges -->

![MIT License][license-shield] ![Repository Size][repository-size-shield] ![Issue Closed][issue-closed-shield]

<!-- 프로젝트 대문 이미지 -->

![alt text](/images/title.png)

<!-- 프로젝트 버튼 -->

[![Report bug][report-bug-shield]][report-bug-url] [![Request feature][request-feature-shield]][request-feature-url]

<!-- 목차 -->

# Table of Contents

- [[1] About the Project](#1-about-the-project)
  - [Features](#features)
  - [Technologies](#technologies)
- [[2] Getting Started](#2-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [[3] Usage](#3-usage)
- [[4] Limits(반드시 읽어주세요.)](#4-limits)
- [[5] Acknowledgement](#5-acknowledgement)
- [[6] Contact](#6-contact)

## [1] About the Project

이 프로젝트는 Pinterest에서 핀으로 꼽아서 보드에 저장된 이미지들을 한 번에 다운로드할 수 있는 크롬 확장 프로그램입니다. 기존의 다운로드 방법은 이미지가 많을 경우 너무 불편하고, 다른 확장 프로그램은 제한이 있거나 오류가 있어 직접 제작하게 되었습니다. 이미지, gif파일 정상적으로 다운 가능하고, 동영상 파일은 다운로드가 불가능합니다.

### Test

| 보드 이름 | 핀 개수 | 걸린 시간 | 다운받지 못한 이미지(동영상 제외) 개수 |
| --------- | ------- | --------- | -------------------------------------- |
| 보드1     | 120개   | 00:00:13  | 0건                                    |
| 보드2     | 476개   | 00:00:20  | 0건                                    |
| 보드3     | 1168개  | 00:01:40  | 0건                                    |

### Features

1. **자동화된 이미지 다운로드**  
   Pinterest 보드에서 이미지를 자동으로 수집하고 다운로드할 수 있는 기능을 제공합니다.

2. **중복 이미지 방지**  
   이미 다운로드한 이미지는 중복으로 처리되지 않도록 `Set`을 이용하여 중복 체크를 수행합니다.

3. **배치 다운로드**  
   한 번에 최대 100개씩 zip으로 묶여 이미지를 다운로드합니다.

4. **이미지 URL을 Base64로 변환**  
   다운로드한 이미지를 Base64 인코딩하여 ZIP 파일에 포함시킵니다.

5. **간편한 크롬 확장 프로그램 사용**  
   직관적인 UI와 간단한 설정으로, 사용자가 손쉽게 이미지를 다운로드할 수 있습니다.

### Technologies

- **JavaScript (ES6+)**
- **Chrome Extensions API**
- **Base64 Encoding**
- **File Handling with Blob API**
- **HTML/CSS (For Extension Popup UI)**

<!-- 아키텍쳐 -->

## [2] Getting Started

### Prerequisites

- **Google Chrome** 또는 Chromium 기반 브라우저

### Installation

1. **Repository 클론 혹은 직접 다운로드**

[클론]

```bash
git clone https://github.com/tnqkr3494/pinterest-image-downloader.git
```

[직접 다운로드]

```plain text
code버튼에서 download zip
```

2. **크롬 확장 프로그램 설치**

```plain text
1. chrome://extensions/ 페이지로 이동

2. "개발자 모드"를 활성화하고 "압축 해제된 확장 프로그램을 로드" 버튼 클릭

3. 클론한 디렉터리 경로를 선택하여 확장 프로그램 설치
```

## Configuration

특별한 설정 파일이 필요하지 않으며, 브라우저에서 직접 확장 프로그램을 설치하고 사용할 수 있습니다.

# [3] Usage

여러 핀들이 모여있는 Pinterest 보드 페이지로 이동합니다.

크롬 확장 프로그램 아이콘을 클릭하여 다운로드를 시작합니다.

# [4] Limits

- ~~`중간에 다운안되는 몇몇 이미지들이 발생.` => 로직 문제로 예상되어 수정 예정~~
- `스크롤 내려갈때 이미지 로딩이 느리면 프로그램에서 이미지를 인식하지 못해서 다운받지 못할 수 있다.` => 해결방안 찾아볼 것
  - 임시해결방안 : 다운로드 받을 보드에서 가장 아래(더이상 스크롤 되지 않을 때까지)를 한번 갔다와서 다시 맨 위로 올라간다. 그러고 프로그램 실행하면 오류없이 전부 다운 가능합니다.
- `Loading progressbar 정확성 문제 해결해야함.` => UI적 문제라 다운에 지장은 없음.
- 가끔 스크롤만 내려가고 다운이 안될 때가 있는데 새로고침하고 다운로드 받으면 지장 없습니다.

# [5] Acknowledgement

Pinterest API: Pinterest의 이미지 URL을 추출하고 다운로드하는 데 사용되었습니다.

Chrome Extensions Documentation: 크롬 확장 프로그램 개발에 참고한 공식 문서들입니다.

# [6] Contact

- 📧 tnqrk3494@naver.com

<!--Url for Badges-->

[license-shield]: https://img.shields.io/badge/license-MIT-template?labelColor=D8D8D8&color=04B4AE
[repository-size-shield]: https://img.shields.io/github/repo-size/tnqkr3494/pinterest-downloader?labelColor=D8D8D8&color=BE81F7
[issue-closed-shield]: https://img.shields.io/github/issues-closed/tnqkr3494/pinterest-downloader?labelColor=D8D8D8&color=FE9A2E

<!--Url for Buttons-->

[preview-shield]: https://img.shields.io/badge/-%F0%9F%98%8E%20Preview-F3F781?style=for-the-badge
[preview-url]: https://ecodev-blog.vercel.app/
[report-bug-shield]: https://img.shields.io/badge/-%F0%9F%90%9E%20report%20bug-F5A9A9?style=for-the-badge
[report-bug-url]: https://github.com/tnqkr3494/pinterest-downloader/issues
[request-feature-shield]: https://img.shields.io/badge/-%E2%9C%A8%20request%20feature-A9D0F5?style=for-the-badge
[request-feature-url]: https://github.com/tnqkr3494/pinterest-downloader/issues
