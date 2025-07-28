// 원격 서버 (211.188.55.131)의 routes/data.js 파일에 추가해야 할 코드

// 데이터 폴더 목록 조회 API
router.get("/folders", async (req, res, next) => {
  try {
    const folders = fs.readdirSync(DATA_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    res.status(200).json({
      success: true,
      folders: folders
    });
  } catch (e) {
    console.error("Error reading folders:", e);
    next(e);
  }
});

// 특정 폴더의 파일 목록 조회 API
router.get("/folders/:folderName/files", async (req, res, next) => {
  try {
    const { folderName } = req.params;
    const folderPath = path.join(DATA_DIR, folderName);
    
    // 폴더 존재 여부 확인
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({
        success: false,
        message: "폴더를 찾을 수 없습니다."
      });
    }
    
    const files = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name);
    
    res.status(200).json({
      success: true,
      files: files
    });
  } catch (e) {
    console.error("Error reading files:", e);
    next(e);
  }
});

// 폴더 내 하위 디렉토리 목록 조회 API (필요시)
router.get("/folders/:folderName/subdirs", async (req, res, next) => {
  try {
    const { folderName } = req.params;
    const folderPath = path.join(DATA_DIR, folderName);
    
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({
        success: false,
        message: "폴더를 찾을 수 없습니다."
      });
    }
    
    const subdirs = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    res.status(200).json({
      success: true,
      subdirs: subdirs
    });
  } catch (e) {
    console.error("Error reading subdirectories:", e);
    next(e);
  }
}); 