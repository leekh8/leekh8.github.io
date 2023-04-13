# frozen_string_literal: true

source "https://rubygems.org"

# faraday-retry gem 추가
gem 'faraday'
gem 'faraday-retry', '~> 2.0'

gemspec

group :jekyll_plugins do
gem 'github-pages'
end

gem "webrick", "~> 1.8"

# Windows 환경에서 파일 변경을 폴링하는데 사용할 wdm gem 추가
platforms :mswin, :mingw, :x64_mingw do
  gem 'wdm','>=0.1.0'
end
