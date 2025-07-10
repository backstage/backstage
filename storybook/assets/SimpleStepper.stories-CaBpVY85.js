import{j as e}from"./jsx-runtime-CvpxdxdE.js";import{r as l}from"./index-DSHF18-l.js";import{M as G,a as J,S as K,b as Q}from"./StepLabel-Be18I0WF.js";import{c as k}from"./translation-B5WnxnAy.js";import{m as V}from"./makeStyles-BpM_75FT.js";import{B as A}from"./Box-Cw3NqR-I.js";import{B as T}from"./Button-YkateTQg.js";import{u as q}from"./useTranslationRef-m705PC51.js";import{T as N}from"./Typography-D-X-TuAe.js";import{T as U}from"./TextField-DsOem37k.js";import"./defaultTheme-BC4DFfCk.js";import"./capitalize-90DKmOiu.js";import"./withStyles-eF3Zax-M.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./Paper-D1gKpVrP.js";import"./react-is.production.min-D0tnNtx9.js";import"./Collapse-D0qgcw_n.js";import"./utils-DlGjxGZ7.js";import"./index-DBvFAGNd.js";import"./TransitionGroupContext-BUwkeBv7.js";import"./useTheme-D_a2aLgU.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./createSvgIcon-D_YgPIMQ.js";import"./TranslationApi-NYdUF01F.js";import"./ApiRef-DDVPwL0h.js";import"./typography-CebPpObz.js";import"./ButtonBase-Bv9QgeU2.js";import"./ownerWindow-BCxlYCSn.js";import"./FormLabel-Pj29aFfQ.js";import"./formControlState-ByiNFc8I.js";import"./isMuiElement-fiJl_Gvd.js";import"./useFormControl-Dtv1idVa.js";import"./InputLabel-DeYOrXqF.js";import"./Select-CTBPi-Gg.js";import"./Popover-DFgV4fgX.js";import"./debounce-DtXjJkxj.js";import"./createChainedFunction-Da-WpsAN.js";import"./Modal-CwuOZwNt.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-Dl07bpo2.js";import"./Grow-DbwKXL8U.js";import"./List-CDGHPTWa.js";import"./ListContext-u-bsdFbB.js";import"./useControlled-i6Pam0ca.js";const w=()=>{},Y=l.createContext({stepperLength:0,stepIndex:0,setStepIndex:w,stepHistory:[],setStepHistory:w,onStepChange:w});function x(t){const{children:r,elevated:a,onStepChange:i,activeStep:n=0}=t,[p,o]=l.useState(n),h=Array.from({length:n+1},(u,d)=>d),[y,g]=l.useState(h);l.useEffect(()=>{o(n)},[n]);const v=[];let b;return l.Children.forEach(r,u=>{l.isValidElement(u)&&(u.props.end?b=u:v.push(u))}),e.jsxs(e.Fragment,{children:[e.jsx(Y.Provider,{value:{stepIndex:p,setStepIndex:o,stepHistory:y,setStepHistory:g,onStepChange:i,stepperLength:l.Children.count(r)},children:e.jsx(G,{activeStep:p,orientation:"vertical",elevation:a?2:0,children:v})}),p>=l.Children.count(r)-1&&b]})}x.__docgenInfo={description:"",methods:[],displayName:"SimpleStepper",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};const W=V(t=>({root:{marginTop:t.spacing(3),"& button":{marginRight:t.spacing(1)}}}),{name:"BackstageSimpleStepperFooter"}),z=({text:t,handleClick:r})=>{const{t:a}=q(k);return e.jsx(T,{onClick:r,children:t||a("simpleStepper.reset")})},X=({text:t,handleClick:r,disabled:a,last:i,stepIndex:n})=>{const{t:p}=q(k);return e.jsx(T,{variant:"contained",color:"primary",disabled:a,"data-testid":`nextButton-${n}`,onClick:r,children:t||p(i?"simpleStepper.finish":"simpleStepper.next")})},Z=({text:t,handleClick:r,disabled:a,stepIndex:i})=>{const{t:n}=q(k);return e.jsx(T,{variant:"outlined",color:"primary",disabled:a,"data-testid":`skipButton-${i}`,onClick:r,children:t||n("simpleStepper.skip")})},ee=({text:t,handleClick:r,disabled:a,stepIndex:i})=>{const{t:n}=q(k);return e.jsx(T,{onClick:r,"data-testid":`backButton-${i}`,disabled:a,children:t||n("simpleStepper.back")})},I=({actions:t={},children:r})=>{const a=W(),{stepperLength:i,stepIndex:n,setStepIndex:p,stepHistory:o,setStepHistory:h,onStepChange:y}=l.useContext(Y),g=(d,C)=>{C&&C(),y&&y(n,d),p(d)},v=()=>{const d=t.nextStep?t.nextStep(n,i-1):n+1;g(d,t.onNext),h([...o,d])},b=()=>{o.pop(),g(o[o.length-1],t.onBack),h([...o])},u=()=>{g(0,t.onRestart),h([0])};return e.jsxs(A,{className:a.root,children:[[void 0,!0].includes(t.showBack)&&n!==0&&e.jsx(ee,{text:t.backText,handleClick:b,disabled:n===0,stepIndex:n}),t.showSkip&&e.jsx(Z,{text:t.skipText,handleClick:v,disabled:!!i&&n>=i||!!t.canSkip&&!t.canSkip(),stepIndex:n}),[void 0,!0].includes(t.showNext)&&e.jsx(X,{text:t.nextText,handleClick:v,disabled:!!i&&n>=i||!!t.canNext&&!t.canNext(),stepIndex:n}),t.showRestart&&n!==0&&e.jsx(z,{text:t.restartText,handleClick:u,stepIndex:n}),r]})};z.__docgenInfo={description:"",methods:[],displayName:"RestartBtn",props:{text:{required:!1,tsType:{name:"string"},description:""},handleClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},stepIndex:{required:!0,tsType:{name:"number"},description:""}}};I.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperFooter",props:{actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  showNext?: boolean;
  canNext?: () => boolean;
  onNext?: () => void;
  nextStep?: (current: number, last: number) => number;
  nextText?: string;

  showBack?: boolean;
  backText?: string;
  onBack?: () => void;

  showRestart?: boolean;
  canRestart?: () => boolean;
  onRestart?: () => void;
  restartText?: string;

  showSkip?: boolean;
  canSkip?: () => boolean;
  onSkip?: () => void;
  skipText?: string;
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:"",defaultValue:{value:"{}",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const te=V(t=>({end:{padding:t.spacing(3)}}),{name:"SimpleStepperStep"});function s(t){const{title:r,children:a,end:i,actions:n,...p}=t,o=te();return i?e.jsxs(A,{className:o.end,children:[e.jsx(N,{variant:"h6",children:r}),a,e.jsx(I,{actions:{...n||{},showNext:!1}})]}):e.jsxs(J,{...p,children:[e.jsx(K,{children:e.jsx(N,{variant:"h6",children:r})}),e.jsxs(Q,{children:[a,e.jsx(I,{actions:n})]})]})}s.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperStep",props:{title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactElement"},description:""},end:{required:!1,tsType:{name:"boolean"},description:""},actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  showNext?: boolean;
  canNext?: () => boolean;
  onNext?: () => void;
  nextStep?: (current: number, last: number) => number;
  nextText?: string;

  showBack?: boolean;
  backText?: string;
  onBack?: () => void;

  showRestart?: boolean;
  canRestart?: () => boolean;
  onRestart?: () => void;
  restartText?: string;

  showSkip?: boolean;
  canSkip?: () => boolean;
  onSkip?: () => void;
  skipText?: string;
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:""}}};const Ge={title:"Navigation/SimpleStepper",component:x},j={elevated:!1,activeStep:0},c=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]});c.args=j;const m=t=>{const[r,a]=l.useState(!1);return e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 with required field",actions:{canNext:()=>r},children:e.jsx(U,{variant:"outlined",placeholder:"Required*",onChange:i=>a(!!i.target.value)})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]})};m.args=j;const S=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Success!",end:!0,children:e.jsx("div",{children:"You've completed the Stepper"})})]});S.args=j;const f=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 (Optional)",actions:{showSkip:!0},children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})})]});m.args=j;c.__docgenInfo={description:"",methods:[],displayName:"Default",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};m.__docgenInfo={description:"",methods:[],displayName:"ConditionalButtons",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};S.__docgenInfo={description:"",methods:[],displayName:"CompletionStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"OptionalStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};var R,B,_;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`(args: StepperProps) => <SimpleStepper {...args}>
    <SimpleStepperStep title="Step 1">
      <div>This is the content for step 1</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 2">
      <div>This is the content for step 2</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 3">
      <div>This is the content for step 3</div>
    </SimpleStepperStep>
  </SimpleStepper>`,...(_=(B=c.parameters)==null?void 0:B.docs)==null?void 0:_.source}}};var E,H,O;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`(args: StepperProps) => {
  const [required, setRequired] = useState(false);
  return <SimpleStepper {...args}>
      <SimpleStepperStep title="Step 1 with required field" actions={{
      canNext: () => required
    }}>
        <TextField variant="outlined" placeholder="Required*" onChange={e => setRequired(!!e.target.value)} />
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 3">
        <div>This is the content for step 3</div>
      </SimpleStepperStep>
    </SimpleStepper>;
}`,...(O=(H=m.parameters)==null?void 0:H.docs)==null?void 0:O.source}}};var F,P,L;S.parameters={...S.parameters,docs:{...(F=S.parameters)==null?void 0:F.docs,source:{originalSource:`(args: StepperProps) => {
  return <SimpleStepper {...args}>
      <SimpleStepperStep title="Step 1">
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Success!" end>
        <div>You've completed the Stepper</div>
      </SimpleStepperStep>
    </SimpleStepper>;
}`,...(L=(P=S.parameters)==null?void 0:P.docs)==null?void 0:L.source}}};var $,D,M;f.parameters={...f.parameters,docs:{...($=f.parameters)==null?void 0:$.docs,source:{originalSource:`(args: StepperProps) => {
  return <SimpleStepper {...args}>
      <SimpleStepperStep title="Step 1 (Optional)" actions={{
      showSkip: true
    }}>
        <div>This is the content for step 1</div>
      </SimpleStepperStep>
      <SimpleStepperStep title="Step 2">
        <div>This is the content for step 2</div>
      </SimpleStepperStep>
    </SimpleStepper>;
}`,...(M=(D=f.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};const Je=["Default","ConditionalButtons","CompletionStep","OptionalStep"];export{S as CompletionStep,m as ConditionalButtons,c as Default,f as OptionalStep,Je as __namedExportsOrder,Ge as default};
