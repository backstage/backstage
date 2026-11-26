import{r as l,j as e,K as k,L as T,I as N}from"./iframe-bb_jNxxL.js";import{M as H,a as O,S as F,b as P}from"./StepLabel-BdbTDOIO.js";import{B as R}from"./Box-DOhXTkmR.js";import{m as B}from"./makeStyles-CgTSz4WE.js";import{B as q}from"./Button-BO623MIw.js";import{T as L}from"./TextField-C-PU6ssg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B9sM2jn7.js";import"./Collapse-C1vt9U0h.js";import"./styled-Bf8yAc5R.js";import"./Select-DJcOrX1R.js";import"./Popover-Bu0C619z.js";import"./Modal-Bkdw9VoW.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-B4509XJg.js";import"./List-BoIjCh7L.js";import"./ListContext-oQxTFKFx.js";import"./formControlState-CEd5QU-R.js";import"./FormLabel-BIadkXHW.js";import"./InputLabel-8G5IPCbN.js";const j=()=>{},_=l.createContext({stepperLength:0,stepIndex:0,setStepIndex:j,stepHistory:[],setStepHistory:j,onStepChange:j});function x(t){const{children:r,elevated:a,onStepChange:i,activeStep:n=0}=t,[p,o]=l.useState(n),h=Array.from({length:n+1},(u,d)=>d),[y,g]=l.useState(h);l.useEffect(()=>{o(n)},[n]);const v=[];let b;return l.Children.forEach(r,u=>{l.isValidElement(u)&&(u.props.end?b=u:v.push(u))}),e.jsxs(e.Fragment,{children:[e.jsx(_.Provider,{value:{stepIndex:p,setStepIndex:o,stepHistory:y,setStepHistory:g,onStepChange:i,stepperLength:l.Children.count(r)},children:e.jsx(H,{activeStep:p,orientation:"vertical",elevation:a?2:0,children:v})}),p>=l.Children.count(r)-1&&b]})}x.__docgenInfo={description:"@deprecated Compose an application-specific workflow instead of using SimpleStepper.",methods:[],displayName:"SimpleStepper",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};const $=B(t=>({root:{marginTop:t.spacing(3),"& button":{marginRight:t.spacing(1)}}}),{name:"BackstageSimpleStepperFooter"}),E=({text:t,handleClick:r})=>{const{t:a}=k(T);return e.jsx(q,{onClick:r,children:t||a("simpleStepper.reset")})},D=({text:t,handleClick:r,disabled:a,last:i,stepIndex:n})=>{const{t:p}=k(T);return e.jsx(q,{variant:"contained",color:"primary",disabled:a,"data-testid":`nextButton-${n}`,onClick:r,children:t||p(i?"simpleStepper.finish":"simpleStepper.next")})},M=({text:t,handleClick:r,disabled:a,stepIndex:i})=>{const{t:n}=k(T);return e.jsx(q,{variant:"outlined",color:"primary",disabled:a,"data-testid":`skipButton-${i}`,onClick:r,children:t||n("simpleStepper.skip")})},V=({text:t,handleClick:r,disabled:a,stepIndex:i})=>{const{t:n}=k(T);return e.jsx(q,{onClick:r,"data-testid":`backButton-${i}`,disabled:a,children:t||n("simpleStepper.back")})},C=({actions:t={},children:r})=>{const a=$(),{stepperLength:i,stepIndex:n,setStepIndex:p,stepHistory:o,setStepHistory:h,onStepChange:y}=l.useContext(_),g=(d,I)=>{I&&I(),y&&y(n,d),p(d)},v=()=>{const d=t.nextStep?t.nextStep(n,i-1):n+1;g(d,t.onNext),h([...o,d])},b=()=>{o.pop(),g(o[o.length-1],t.onBack),h([...o])},u=()=>{g(0,t.onRestart),h([0])};return e.jsxs(R,{className:a.root,children:[[void 0,!0].includes(t.showBack)&&n!==0&&e.jsx(V,{text:t.backText,handleClick:b,disabled:n===0,stepIndex:n}),t.showSkip&&e.jsx(M,{text:t.skipText,handleClick:v,disabled:!!i&&n>=i||!!t.canSkip&&!t.canSkip(),stepIndex:n}),[void 0,!0].includes(t.showNext)&&e.jsx(D,{text:t.nextText,handleClick:v,disabled:!!i&&n>=i||!!t.canNext&&!t.canNext(),stepIndex:n}),t.showRestart&&n!==0&&e.jsx(E,{text:t.restartText,handleClick:u,stepIndex:n}),r]})};E.__docgenInfo={description:"",methods:[],displayName:"RestartBtn",props:{text:{required:!1,tsType:{name:"string"},description:""},handleClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},stepIndex:{required:!0,tsType:{name:"number"},description:""}}};C.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperFooter",props:{actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:"",defaultValue:{value:"{}",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const A=B(t=>({end:{padding:t.spacing(3)}}),{name:"SimpleStepperStep"});function s(t){const{title:r,children:a,end:i,actions:n,...p}=t,o=A();return i?e.jsxs(R,{className:o.end,children:[e.jsx(N,{variant:"h6",children:r}),a,e.jsx(C,{actions:{...n||{},showNext:!1}})]}):e.jsxs(O,{...p,children:[e.jsx(F,{children:e.jsx(N,{variant:"h6",children:r})}),e.jsxs(P,{children:[a,e.jsx(C,{actions:n})]})]})}s.__docgenInfo={description:"@deprecated Compose an application-specific workflow instead of using SimpleStepper.",methods:[],displayName:"SimpleStepperStep",props:{title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactElement"},description:""},end:{required:!1,tsType:{name:"boolean"},description:""},actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:""}}};const ue={title:"Navigation/SimpleStepper",component:x,tags:["!manifest"]},w={elevated:!1,activeStep:0},c=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]});c.args=w;const m=t=>{const[r,a]=l.useState(!1);return e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 with required field",actions:{canNext:()=>r},children:e.jsx(L,{variant:"outlined",placeholder:"Required*",onChange:i=>a(!!i.target.value)})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]})};m.args=w;const S=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Success!",end:!0,children:e.jsx("div",{children:"You've completed the Stepper"})})]});S.args=w;const f=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 (Optional)",actions:{showSkip:!0},children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})})]});m.args=w;c.__docgenInfo={description:"",methods:[],displayName:"Default",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};m.__docgenInfo={description:"",methods:[],displayName:"ConditionalButtons",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};S.__docgenInfo={description:"",methods:[],displayName:"CompletionStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"OptionalStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`(args: StepperProps) => <SimpleStepper {...args}>
    <SimpleStepperStep title="Step 1">
      <div>This is the content for step 1</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 2">
      <div>This is the content for step 2</div>
    </SimpleStepperStep>
    <SimpleStepperStep title="Step 3">
      <div>This is the content for step 3</div>
    </SimpleStepperStep>
  </SimpleStepper>`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
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
}`,...m.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
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
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`(args: StepperProps) => {
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
}`,...f.parameters?.docs?.source}}};const de=["Default","ConditionalButtons","CompletionStep","OptionalStep"];export{S as CompletionStep,m as ConditionalButtons,c as Default,f as OptionalStep,de as __namedExportsOrder,ue as default};
