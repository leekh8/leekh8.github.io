---
categories: [Trouble Shooting]
tags: [Aqua Cycle, project, troubleshoot]
img_path: /assets/lib/post-img/
mermaid: true
---

# Aqua Cycle

- [AI School GitHub](https://github.com/2023-AISCHOOL-IOTA/Cat_Kim)

## 팀

- `팀장` (나): 백엔드 서버 (`Flask`) 담당
- `팀원 1`: 시각화 (`Flutter`) 담당
- `팀원 2`: DB (`MYSQL`) 담당
- `팀원 3`: `아두이노` 담당

## 주제 선정, 기획

- `브레인스토밍` 후 토론을 거쳐 주제를 선정했지만, 멘토링을 받으며 오히려 방향이 전환되었다.
- 초반에는 어항에 화분이 추가되는 개념으로 어항의 물갈이를 용이하게 하기 위해 물통이 달린 구조로 생각하였다.
- 멘토링 후에는 `아쿠아포닉스` 개념을 기반으로 방향이 전환되었다.
- 또 초반에 코로나 확진으로 참여를 못 해 기획에 참여하는 것에 어려움이 있었다.
- 코로나 격리 후 상의해 보니 `아쿠아포닉스`에서도 수경재배를 하는 식으로 변경이 되어 있었다.
- 시간이 촉박한 관계로 주제와 기획이 완벽히 정립되지 않은 채 시작하다 보니 어려움이 있었다.

## 기술 스택

- DB는 `MYSQL`을 받았다.
- 학습했던 Python을 활용하기 위해 Flask를 백엔드단의 서버로 사용하기로 하였다.
- `아두이노`와 `라즈베리` 중 활용이 더 용이한 `아두이노`를 사용하기로 하였다.
- 시각화는 처음에는 `React`를 활용해 웹 페이지를 띄우려고 하였으나, 팀원들이 `React` 활용이 어렵다고 하여 Flutter가 가능한 팀원이 전담하여 애플리케이션을 제작하기로 하였다.

## ERD

- DB 멘토링을 통해 `ERD`를 결정하였다.
- 식물과 물고기의 정보를 담을 `PLANT`, `FISH`와 사용자 `USER`, 센서 `SENSOR`, 제품 `PRODUCT` 총 5개의 테이블을 구성하였다.
- 다만 `ERD` 구성 자체에서 센서의 데이터 관리가 조금 어려울 것 같다는 의견이 있었다.
- 추후 서술하겠지만 실제로 어려움이 있었다

## 초반 세팅

- 이 프로젝트 자체에서 자의는 아니었지만, 팀장이 되었기 때문에 팀원들 모두가 각자 얻어가는 것들이 있기를 바랐다.
- 초반 Flask 서버와 DB 연결을 초반에 미리 정리해 두고 DB의 `SQL`문과 관련된 작업과 산출문서 작업을 `팀원 2`에게 분담하였다.
- 사용하고자 한 `아두이노` 센서가 아직 도착하지 않아 `팀원 3`이 `아두이노` 코드만 먼저 작성해 두었다.
- `팀원 1`은 `Flutter` 세팅을 진행하였고 테스트를 위해 안드로이드 공기계를 제공했다.

## db 모델링

- `MYSQL`을 받아 `Flask`와의 연결을 먼저 진행했다.
- `팀원 2`가 `ERD`를 작성하여 테이블을 생성하였다.

  ```python
  conn = ps.connect(host=`HOST`, port=`PORT`, user=`USER`, password=`PW`, database=`DB`)

  // PRODUCT
  // +--------------+-------------+----------+-----+----------------+--------------------------+
  // | Field        | Type        | Required | Key | Default        | Extra                    |
  // +--------------+-------------+----------+-----+----------------+--------------------------+
  // | product_code | INT         | true     | PK  | Auto generated | 제품 고유 id              |
  // | user_id      | VARCHAR(45) |          | FK  |                | 사용자 외래키             |
  // | fish_code    | VARCHAR(45) |          | FK  |                | 물고기 외래키             |
  // | plant_code   | VARCHAR(45) |          | FK  |                | 식물 외래키               |
  // | sensor_code  | VARCHAR(45) |          | FK  |                | 센서 외래키               |
  // +--------------+-------------+----------+-----+----------------+--------------------------+

    // USER
  // +--------------+-------------+----------+-----+----------------+--------------------------+
  // | Field        | Type        | Required | Key | Default        | Extra                    |
  // +--------------+-------------+----------+-----+----------------+--------------------------+
  // | user_id      | VARCHAR(45) | true     | PK  |                | 사용자 고유 id            |
  // | name         | VARCHAR(45) | true     |     |                | 사용자 이름               |
  // | email        | VARCHAR(45) | true     |     |                | 사용자 이메일             |
  // | password     | VARCHAR(45) | true     |     |                | 비밀번호                  |
  // | phone_number | VARCHAR(45) | true     |     |                | 핸드폰 번호               |
  // | start_date   | DATE        | true     |     |                | 가입일                    |
  // +--------------+-------------+----------+-----+----------------+--------------------------+

    // SENSOR
  // +---------------------+-------------+----------+-----+----------------+--------------------------+
  // | Field               | Type        | Required | Key | Default        | Extra                    |
  // +---------------------+-------------+----------+-----+----------------+--------------------------+
  // | sensor_code         | VARCHAR(45) | true     | PK  |                | 센서 고유 id              |
  // | sensor_name         | VARCHAR(45) | true     |     |                | 센서 이름                 |
  // | sensor_result_value | INT         | true     |     |                | 센서 값                   |
  // +---------------------+-------------+----------+-----+----------------+--------------------------+

    // PLANT
  // +----------------+-------------+----------+-----+----------------+--------------------------+
  // | Field          | Type        | Required | Key | Default        | Extra                    |
  // +----------------+-------------+----------+-----+----------------+--------------------------+
  // | plant_code     | VARCHAR(45) | true     | PK  |                | 식물 고유 id              |
  // | plant_name     | VARCHAR(45) | true     |     |                | 식물 이름                 |
  // | plant_info     | LONGTEXT    | true     |     |                | 식물 정보                 |
  // | plant_max_temp | INT         | true     |     |                | 식물 최대 적정 온도       |
  // | plant_min_temp | INT         | true     |     |                | 식물 최소 적정 온도       |
  // +----------------+-------------+----------+-----+----------------+--------------------------+

    // FISH
  // +----------------+-------------+----------+-----+----------------+--------------------------+
  // | Field          | Type        | Required | Key | Default        | Extra                    |
  // +----------------+-------------+----------+-----+----------------+--------------------------+
  // | fish_code     | VARCHAR(45) | true     | PK  |                | 물고기 고유 id             |
  // | fish_name     | VARCHAR(45) | true     |     |                | 물고기 이름                |
  // | fish_info     | LONGTEXT    | true     |     |                | 물고기 정보                |
  // | fish_max_temp | INT         | true     |     |                | 물고기 최대 적정 온도      |
  // | fish_min_temp | INT         | true     |     |                | 물고기 최소 적정 온도      |
  // +----------------+-------------+----------+-----+----------------+--------------------------+

  ```

## 개발

- 언제나처럼 개발만 할 수 있는건 아니었다.
- 사이사이 인간관계가 제일 어렵고 힘든 일이지만 또 잘 해내야 어른이라고 생각한다.

### db

- `MYSQL`을 `pymysql`을 활용해 연결하였다
- 멘토링 후 정한 테이블 구조를 `팀원 2`가 잘 이해하지 못해 어려움이 있었다.

```python
  def save_sensor_data(sensor_data):  # 센서 데이터 저장
    try:
      with conn.cursor() as curs:
        sql = 'INSERT INTO sensor(sensor_code, sensor_name, sensor_result_value) VALUES (%s, %s, %s)'
        curs.executemany(sql, sensor_data)
        conn.commit()
    except Exception as e:
      print("Error saving sensor data: ", e)


  def get_sensor_data():  # sensor 데이터 조회
    try:
      with conn.cursor() as curs:
        sql = 'select * from sensor'
        curs.execute(sql)

        result = curs.fetchall()
        return result
    except Exception as e:
      print(f"Error fetching sensor data: {e}")
      return []


  def get_fish_data():  # fish 데이터 조회
    try:
      with conn.cursor() as curs:
        sql = 'select * from fish'
        curs.execute(sql)

        result = curs.fetchall()
        return result
    except Exception as e:
      print(f"Error fetching fish data: {e}")
      return []


  def get_plant_data():  # plant 조회
    try:
      with conn.cursor() as curs:
          sql = 'select * from plant'
          curs.execute(sql)
          result = curs.fetchall()
          return result
    except Exception as e:
      print(f"Error fetching plant data: {e}")
      return []


  def get_user_data():  # user 조회
    try:
      with conn.cursor() as curs:
        sql = 'select * from user'
        curs.execute(sql)
        result = curs.fetchall()
        return result
    except Exception as e:
      print(f"Error fetching user data: {e}")
      return []


  def search_fish_data(fish_name):
    with conn.cursor() as curs:
      sql = 'SELECT * FROM fish WHERE fish_name = %s'
      curs.execute(sql, fish_name)
      result = curs.fetchone()
      return result


  def search_plant_data(plant_name):
    with conn.cursor() as curs:
      sql = 'SELECT * FROM plant WHERE plant_name = %s'
      curs.execute(sql, plant_name)
      result = curs.fetchone()
      return result


  def close_connection():
    conn.close()
```

### Arduino

- 원래 `아두이노`에 `블루투스 모듈`을 연결해 블루투스로 센서값을 전달받으려 했지만, `블루투스 모듈` 뽑기 실패로 블루투스 기능은 실패했다.
- 그래서 `ESP32`를 사용해 와이파이로 센서값을 원격으로 받을 수 있도록 수정했다.

```arduino
  #include <Wire.h>
  #include <LiquidCrystal_I2C.h>
  #include <DHT.h>
  #include <OneWire.h>
  #include <DallasTemperature.h>
  #include <WiFi.h>

  // Wi-Fi 설정
  const char* ssid = "www";     // 여기에 Wi-Fi SSID 입력
  const char* password = "ya201022"; // 여기에 Wi-Fi 비밀번호 입력

  // 릴레이 모듈
  const int relayPin = 23;  // 릴레이 제어용 디지털 핀 (IO23 핀)

  // LCD2004 설정
  LiquidCrystal_I2C lcd(0x27, 20, 4);  // 주소, 열 수, 행 수

  // DHT11 센서 설정
  #define DHTPIN 5          // D1 R32 보드의 IO5 핀
  #define DHTTYPE DHT11     // DHT11 센서 타입
  DHT dht(DHTPIN, DHTTYPE);

  // DS18B20 센서 설정
  const int oneWireBus = 18;  // 예시로 18번 핀을 사용
  OneWire oneWire(oneWireBus);
  DallasTemperature sensors(&oneWire);

  // XKC-Y25-NPN 센서 설정
  const int sensorPin = 19;  // XKC-Y25-NPN 센서의 디지털 출력이 연결된 핀 번호 (D19 핀)

  WiFiServer server(80);  // 웹 서버 포트 설정

  void setup() {
    pinMode(relayPin, OUTPUT);
    pinMode(sensorPin, INPUT);

    Serial.begin(9600);

    // Wi-Fi 연결
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
    Serial.println("IP address: ");

    Serial.println(WiFi.localIP());

    lcd.init();
    lcd.backlight();

    dht.begin();
    sensors.begin();

    server.begin();  // 웹 서버 시작
  }

  void loop() {
    // DHT11 센서 읽기
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    if (!isnan(humidity) && !isnan(temperature)) {
      lcd.setCursor(0, 1);
      lcd.print("Humidity: ");
      lcd.print(static_cast<int>(humidity));
      lcd.print("%");
      lcd.setCursor(0, 2);
      lcd.print("Temp : ");
      lcd.print(static_cast<int>(temperature));
      lcd.print("C");
    }
    delay(2000);

    // DS18B20 센서 읽기
    sensors.requestTemperatures();
    float temperatureC = sensors.getTempCByIndex(0);
    float temperatureF = sensors.toFahrenheit(temperatureC);
    lcd.setCursor(0, 3);
    lcd.print("Temp : ");
    lcd.print(static_cast<int>(temperatureC));
    lcd.print("C");
    delay(1000);

    // XKC-Y25-NPN 센서 읽기
    int sensorValue = digitalRead(sensorPin);
    lcd.setCursor(-10, 4);
    lcd.print("Water Level: ");
    lcd.print(sensorValue == HIGH ? "Yes" : "No");
    delay(1000);

    // DS18B20 센서 값에 따른 릴레이 제어
    if (static_cast<int>(temperatureC) <= 25) {
      digitalWrite(relayPin, HIGH);
    } else if (static_cast<int>(temperatureC) >= 28) {
      digitalWrite(relayPin, LOW);
    }

    // 클라이언트 요청 처리
    WiFiClient client = server.available();
    if (client) {
      String response = "<html><body>";
      response += "<h1>Sensor Data</h1>";
      response += "<p>Humidity: " + String(static_cast<int>(humidity)) + "%</p>";
      response += "<p>Temperature: " + String(static_cast<int>(temperature)) + "C</p>";
      response += "<p>DS18B20 Temperature: " + String(static_cast<int>(temperatureC)) + "C</p>";
      response += "<p>Water Level: ";
      response += (sensorValue == HIGH ? "Yes" : "No");
      response += "</p>";
      response += "</body></html>";

      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/html");
      client.println("Connection: close");
      client.println();
      client.println(response);

      delay(10);
      client.stop();
    }
  }

```

### API 명세

- 서버의 동작에 관해 다름 팀원들과 상의를 할 만큼 시간이 넉넉하지 않았기 때문에... 내가 되는대로 했다.
- 코드에서 보이겠지만 급했고... 급했다.

```python
  # Serial port를 통해 입력받은 센서 값 전달
  from flask import Flask, jsonify, request, Response, redirect, render_template
  from flask_cors import CORS
  # import serial as pyserial
  import db
  import json

  # Flask 앱 인스턴스 생성
  app = Flask(__name__)
  app.config['JSON_AS_ASCII'] = False
  CORS(app)


  # 센서 데이터를 저장할 딕셔너리
  sensor_data = {
      'humidity': None,
      'temperature': None,
      'water_temp': None,
      'water_detected': None
  }

  PORT = 'COM8'
  BaudRate = 9600
  TimeOut = 5


  @app.route('/')  # 메인 페이지 라우트
  def welcome():
      return render_template('index.html')


  # @app.route('/sensor', methods=['GET'])
  # def get_sensor_data_from_arduino():
  #     with pyserial.Serial(port=PORT, baudrate=BaudRate, timeout=TimeOut) as ser:
  #         line = ser.readline().decode('utf-8').strip()
  #         values = line.split('\t')

  #         if len(values) != 4:
  #             return jsonify({"error": "Invalid data from sensor"}), 400
  #         try:
  #             humidity, temp_dht, temp_ds18b20, water_detected = map(
  #                 int, line.split('\t'))
  #             sensor_data.update({
  #                 'humidity': humidity,
  #                 'temperature': temp_dht,
  #                 'water_temp': temp_ds18b20,
  #                 'water_detected': water_detected
  #             })

  #             db.save_sensor_data(sensor_data)
  #             return jsonify(sensor_data)

  #         except ValueError:
  #             return jsonify({"error": "Parsing error"}), 400

  # DB 조회


  @app.route('/db/<table_name>', methods=['GET'])
  def view_data(table_name):
      if table_name == 'sensor':
          data = db.get_sensor_data()
          formatted_data = [
              {
                  "code": item[0],
                  "name": item[1],
                  "value": item[2]
              }
              for item in data
          ]
      elif table_name == 'fish':
          data = db.get_fish_data()
          formatted_data = [
              {
                  "code": item[0],
                  "name": item[1],
                  "description": item[2],
                  "min_temp": item[3],
                  "max_temp": item[4]
              }
              for item in data
          ]
      elif table_name == 'plant':
          data = db.get_plant_data()
          formatted_data = [
              {
                  "code": item[0],
                  "name": item[1],
                  "description": item[2],
                  "min_temp": item[3],
                  "max_temp": item[4]
              }
              for item in data
          ]
      elif table_name == 'user':
          data = db.get_user_data()
          formatted_data = [
              {
                  "code": item[0],
                  "name": item[1],
                  "description": item[2],
                  "min_temp": item[3],
                  "max_temp": item[4]
              }
              for item in data
          ]
      else:
          return jsonify({"error": "Invalid table name"}), 400

      # formatted_data = '<br>'.join(map(str, data))
      # return f"<a href=../../>Home</a><h1>DB Data</h1><pre>{formatted_data}</pre>"
      print(formatted_data)
      response_data = json.dumps(formatted_data, ensure_ascii=False)
      response = Response(
          response_data, content_type="application/json; charset=utf-8")
      return response

  # DB 추가


  @app.route('/db/add', methods=['POST'])
  def add_to_db():
      humidity = request.form.get('humidity')
      temperature = request.form.get('temperature')
      water_level = request.form.get('water_level')
      water_detected = request.form.get('water_detected')

      if not all([humidity, temperature, water_level, water_detected]):
          return jsonify({"error": "All fields are required"}), 400

      data = {
          'humidity': humidity,
          'temperature': temperature,
          'water_level': water_level,
          'water_detected': water_detected
      }

      db.save_sensor_data(data)
      return redirect('/db/sensor')

  # 검색


  @app.route('/search/fish', methods=['POST'])
  def search_fish():
      fish_name = request.form['fish_name']
      data = db.search_fish_data(fish_name)

      formatted_data = [
          {
              "code": item[0],
              "name": item[1],
              "description": item[2],
              "min_temp": item[3],
              "max_temp": item[4]
          }
          for item in data
      ]

      if data:
          return jsonify(formatted_data)
      else:
          return jsonify({"message": "No fish found with that name!"})


  @app.route('/search/plant', methods=['POST'])
  def search_plant():
      plant_name = request.form['plant_name']
      data = db.search_plant_data(plant_name)
      print(jsonify(data))
      # formatted_data = []

      # for item in data:
      #     try:
      #         formatted_data.append({
      #             "code": item[0],
      #             "name": item[1],
      #             "description": item[2],
      #             "min_temp": item[3],
      #             "max_temp": item[4]
      #         })
      #     except IndexError:
      #         formatted_data.append({
      #             "code": item[0] if len(item) > 0 else "N/A",
      #             "name": item[1] if len(item) > 1 else "N/A",
      #             "description": item[2] if len(item) > 2 else "N/A",
      #             "min_temp": item[3] if len(item) > 3 else "N/A",
      #             "max_temp": item[4] if len(item) > 4 else "N/A"
      #         })

      if data:
          return jsonify(data)
      else:
          return jsonify({"message": "No plant found with that name!"})


  # Flask 앱 실행
  if __name__ == '__main__':
      app.run(host="0.0.0.0", port=9000, debug=True)
```

## 느낀점

- 이전 프로젝트와 달리 처음 기획과 주제가 명확하지 않으니 개발 내내 기준 없이 흔들렸다.
- 주제와 기획을 명확하게 정리하고 시작해야 개발도 그나마 순탄하게 진행될 수 있다는 것을 다시 한번 느꼈다.
- 또 하나를 가지고 각자 생각하는 것이 다르기 때문에 오는 소통 오류도 미리미리 정리하고 가야 함을 느꼈다.
- 지금 당장 내가 담당한 일이 바쁘다고 해서 소통을 소홀히 하면 나중에 반드시 피를 보는... 것을 느꼈다.
- 프로젝트를 하며 언제나 모든 사람은 다 다르고, 그렇기 때문에 재밌다고 생각하지만, 마냥 재밌기만 한 것은 아닌 것 같다.
- 또 `팀장`으로서 이끌고 관리하는 역할을 잘 수행하지 못한 것 같아 아쉬웠다.
- 사람들 사이에서 인간관계를 관리하기는 역시 어려운 일이다.
- 이번 프로젝트를 계기로 `Python`와 `MYSQL`에 대해 더 알게 된것 뿐만아니라 사람들과 소통하는 것에 대한 중요성을 다시 한번 체감했다.
- 또 `팀원 1`이 맡아준 `Flutter` 시각화에 중간중간 함께하면서 `Flutter`에 대해서도 조금 배운 것 같아 뿌듯하다.
