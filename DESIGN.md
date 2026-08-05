STYLE_MODE: fidelity # fidelity = Figma 원본 값 그대로 / normalize = 아래 6번 규칙으로 kit 스케일에 스냅
LAYOUT_MODE: redesign # extract = Figma 프레임 구조 그대로 / redesign = 스타일만 참고, 레이아웃은 자유 설계

역할: 지정된 Figma 노드를 이 프로젝트의 shadcn-vue 컴포넌트로 변환한다.
필요한 컴포넌트가 프로젝트에 없으면 코드를 쓰기 전에 먼저 설치한다.

1. 프로젝트 현황 파악
   - /src/components/ui/ 를 먼저 조회해서 현재 설치된 shadcn-vue
     컴포넌트 목록을 확인한다. (경로가 다르면 components.json 참고)
   - components.json이 있으면 기존 aliases, style, baseColor 설정을 그대로 존중한다. 임의로 새 설정을 만들지 않는다.

2. Figma 데이터 수집
   - get_metadata로 대상 노드의 레이어 트리를 먼저 확인한다.
   - get_code 호출 시 framework=Vue, styling=tailwind를 명시한다.
   - get_variable_defs로 색상/스페이싱/타이포 변수를 수집한다.
   - get_code_connect_map이 있으면 최우선으로 신뢰한다.
   - LAYOUT_MODE=redesign이면 get_code는 프레임 전체가 아니라
     개별 컴포넌트 인스턴스 단위로만 호출한다. 프레임의 auto-layout
     배치 정보는 수집하지 않는다.

3. 컴포넌트 매핑 (설계 단계, 아직 코드 작성 금지)
   - 베이스 파일(예: *.vue)을 읽고 현재 제공하는 기능/데이터
     목록을 정리한다.
   - 위 기능들을 담을 새로운 정보 구조(섹션 구성, 우선순위, 화면 흐름)를
     설계한다. Figma의 레이아웃은 반드시 참고할 필요는 없다.
   - 날씨 도메인에서 통상적으로 쓰이는 요소 중 현재 없는 것을 제안한다.
     단, 실제 사용 가능한 API/데이터로 채울 수 있는 것만 제안하고,
     근거 없는 항목은 플레이스홀더 UI로 명시한 뒤 "실제 데이터 연동 필요" 라고 표시한다.
   - 이 설계안(기존 기능 목록 + 새 섹션 제안 + 이유)을 먼저 텍스트로
     출력하고, 사용자 확인 후 다음 단계로 진행한다.
   - 각 Figma 레이어/인스턴스에 대해 어떤 컴포넌트가 매칭되는지
     매핑표 초안을 먼저 작성한다. 매칭되는 게 없으면
     "raw markup"으로 명시하고 억지로 끼워 맞추지 않는다.
   - 이 단계까지는 어떤 파일도 생성/수정하지 않는다.

4. 컴포넌트 설치
   - 3번 매핑표에서 필요하다고 판단된 컴포넌트 중 1번에서 확인한
     설치 목록에 없는 것들을 전부 모은다.
   - 하나씩 설치하지 말고, 필요한 컴포넌트를 모두 모아
     한 번의 명령으로 일괄 설치한다.
     예: bunx --bun shadcn-vue@latest add button card dialog input
   - 설치 명령 실행 후, 각 컴포넌트 파일이 실제로
     /src/components/ui/ 에 생성됐는지 다시 확인한다.
     확인되지 않은 컴포넌트는 설치 성공으로 간주하지 말고
     해당 요소는 raw markup으로 대체한 뒤 이유를 기록한다.
   - 이미 설치돼 있던 컴포넌트는 재설치하거나 덮어쓰지 않는다.

5. variant/prop 매핑
   - Figma 컴포넌트의 variant 속성(Size, State, Style 등)은
     커스텀 클래스가 아니라 해당 컴포넌트의 variant/size/disabled
     같은 실제 prop으로 매핑한다.
   - 이 prop들이 실제로 존재하는지 3-4번에서 설치/확인된
     컴포넌트 소스 코드를 열어 검증한 뒤 사용한다.

6. 디자인 토큰 매핑
   - STYLE_MODE=fidelity: Figma 변수를 프로젝트의 기존 Tailwind/
     shadcn CSS 변수(--primary, --radius 등)에 매핑하되,
     대응 토큰이 없는 값만 원본 값을 그대로 쓴다.
   - STYLE_MODE=normalize: 원본 pixel/hex 값을 절대값이 아니라
     의도로 취급해 가장 가까운 spacing/radius/type 스케일 토큰과
     색상 토큰으로 스냅한다. 원본값과 적용값을 매핑표에 함께 기록한다.

7. 레이아웃
   - Figma의 auto-layout(방향, gap, padding, align/justify)을
     Tailwind flex/grid 유틸리티로 재현하고, 레이어 계층과
     템플릿 구조를 최대한 1:1로 유지한다.

8. 근거 원칙
   - 툴 호출 결과로 확인되기 전까지는 어떤 컴포넌트명, prop명,
     파일 경로도 단정하지 않는다. 확인 없이 단정한 부분은 무효로
     간주하고 다시 검증한다.

9. 출력 형식
   - 하나의 .vue SFC, <script setup lang="ts">, import는
     '@/components/ui/...' 경로 사용.

10. 최종 보고
    - 다음 네 가지를 표/목록으로 정리해서 출력한다.
      a) Figma 레이어명 → 사용한 컴포넌트/prop
      b) 새로 설치한 컴포넌트 목록 / 이미 있던 컴포넌트 목록
      c) 매핑 실패해 raw markup으로 처리한 요소
      d) STYLE_MODE=normalize였다면 원본값 → 적용값 변경 내역
    - get_screenshot으로 렌더 결과를 원본과 비교하고 차이가 있으면
      이유를 설명한다.
    - 원본 대비 새로 추가된 섹션/기능과 그 이유를 별도 항목으로 정리한다.
