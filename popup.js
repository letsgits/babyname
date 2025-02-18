document.addEventListener('DOMContentLoaded', function() {
  // 初始化国际化文本
  function initI18n() {
    // 处理普通文本
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const messageName = element.getAttribute('data-i18n');
      element.textContent = chrome.i18n.getMessage(messageName);
    });
    
    // 处理占位符文本
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const messageName = element.getAttribute('data-i18n-placeholder');
      element.placeholder = chrome.i18n.getMessage(messageName);
    });

    // 处理 select 选项的文本
    document.querySelectorAll('select option[data-i18n]').forEach(element => {
      const messageName = element.getAttribute('data-i18n');
      element.textContent = chrome.i18n.getMessage(messageName);
    });
  }

  // 初始化国际化
  initI18n();

  // 性别选择逻辑
  const genderBtns = document.querySelectorAll('.gender-btn');
  genderBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      genderBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 名字长度选择逻辑
  const nameLengthBtns = document.querySelectorAll('.name-length-btn');
  nameLengthBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      nameLengthBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 期望寓意标签点击逻辑
  const meaningTags = document.querySelectorAll('.meaning-tag');
  const customMeaning = document.getElementById('custom-meaning');

  meaningTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const tagValue = this.textContent;
      
      if (this.classList.contains('active')) {
        // 移除active类
        this.classList.remove('active');
        // 从文本框中移除对应的行
        let currentText = customMeaning.value;
        currentText = currentText
          .split('\n')
          .filter(line => !line.includes(tagValue))
          .join('\n');
        customMeaning.value = currentText.trim();
      } else {
        // 添加active类
        this.classList.add('active');
        // 添加新的期望文本
        let currentText = customMeaning.value;
        if (currentText) {
          currentText += '\n';
        }
        currentText += chrome.i18n.getMessage('meaningPrefix') + tagValue;
        customMeaning.value = currentText.trim();
      }
      
      // 添加点击反馈动画
      this.classList.add('tag-clicked');
      setTimeout(() => {
        this.classList.remove('tag-clicked');
      }, 300);
    });
  });

  // 表单验证函数
  function validateForm() {
    let isValid = true;
    
    // 清除所有错误状态
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
      const errorTip = group.querySelector('.error-tip');
      if (errorTip) {
        errorTip.style.display = 'none';
      }
    });

    // 验证姓氏
    const surname = document.getElementById('surname').value.trim();
    if (!surname) {
      isValid = false;
      const group = document.getElementById('surname').closest('.form-group');
      group.classList.add('has-error');
      document.getElementById('surname-error').style.display = 'block';
    }

    // 验证出生日期
    const birthDate = document.getElementById('birthDate').value;
    if (!birthDate) {
      isValid = false;
      const group = document.getElementById('birthDate').closest('.form-group');
      group.classList.add('has-error');
      document.getElementById('birth-error').style.display = 'block';
    }

    return isValid;
  }

  // 开始取名按钮点击逻辑
  document.getElementById('startNaming').addEventListener('click', () => {
    if (!validateForm()) {
      return;
    }

    const surname = document.getElementById('surname').value.trim();
    const gender = document.querySelector('.gender-btn.active').dataset.value;
    const nameLength = document.querySelector('.name-length-btn.active').dataset.value;
    const birthDate = document.getElementById('birthDate').value;
    const birthTime = document.getElementById('birthTime').value;
    // 将换行符替换为逗号，并去除首尾空格
    const requirements = document.getElementById('custom-meaning').value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item) // 过滤掉空行
      .join(',');

    // 构建请求参数
    const params = new URLSearchParams({
      surname,
      gender,
      nameLength,
      birthDate,
      birthTime,
      requirements,
      submit: '1'
    });

    // 根据当前语言选择URL
    const currentLang = chrome.i18n.getUILanguage();
    const baseUrl = currentLang.toLowerCase().startsWith('zh-cn') 
      ? 'https://bbname.cc/zh-CN/naming'
      : 'https://bbname.cc/naming';
    
    // 在新标签页中打开网址
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  });

  // 添加输入事件监听，在用户输入时清除错误提示
  document.getElementById('surname').addEventListener('input', function() {
    const group = this.closest('.form-group');
    group.classList.remove('has-error');
    document.getElementById('surname-error').style.display = 'none';
  });

  document.getElementById('birthDate').addEventListener('input', function() {
    const group = this.closest('.form-group');
    group.classList.remove('has-error');
    document.getElementById('birth-error').style.display = 'none';
  });
}); 