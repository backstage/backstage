import{j as e}from"./jsx-runtime-hv06LKfz.js";import{r as l}from"./index-D8-PC79C.js";import{M as H,a as O,S as F,b as P}from"./StepLabel-rHHXjgLz.js";import{c as k}from"./translation-BlsjZX4-.js";import{m as R}from"./makeStyles-CJp8qHqH.js";import{B}from"./Box-dSpCvcz2.js";import{B as T}from"./Button-aFPoPc-s.js";import{u as q}from"./useTranslationRef-DKy5gnX5.js";import{T as N}from"./Typography-NhBf-tfS.js";import{T as L}from"./TextField-DmWL4a35.js";import"./defaultTheme-NkpNA350.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./Paper-BiLxp0Cg.js";import"./index-DnL3XN75.js";import"./Collapse-NRZqYfCr.js";import"./utils-DMni-BWz.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./useTheme-Dk0AiudM.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./createSvgIcon-D-gz-Nq7.js";import"./TranslationApi-CV0OlCW4.js";import"./ApiRef-ByCJBjX1.js";import"./typography-Mwc_tj4E.js";import"./ButtonBase-DXo3xcpP.js";import"./ownerWindow-CjzjL4wv.js";import"./Select-aGy7NPFn.js";import"./Popover-CKCFsMrH.js";import"./debounce-DtXjJkxj.js";import"./createChainedFunction-Da-WpsAN.js";import"./Grow-BOepmPk1.js";import"./Modal-m69wb1rs.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./List-Bi5n8Alr.js";import"./ListContext-Brz5ktZ2.js";import"./formControlState-ByiNFc8I.js";import"./useControlled-CliGfT3L.js";import"./useFormControl-Dd17crCt.js";import"./FormLabel-CjYxj4ka.js";import"./isMuiElement-DKhW5xVU.js";import"./InputLabel-BbZEQtws.js";const w=()=>{},_=l.createContext({stepperLength:0,stepIndex:0,setStepIndex:w,stepHistory:[],setStepHistory:w,onStepChange:w});function x(t){const{children:r,elevated:a,onStepChange:i,activeStep:n=0}=t,[p,o]=l.useState(n),h=Array.from({length:n+1},(u,d)=>d),[y,g]=l.useState(h);l.useEffect(()=>{o(n)},[n]);const v=[];let b;return l.Children.forEach(r,u=>{l.isValidElement(u)&&(u.props.end?b=u:v.push(u))}),e.jsxs(e.Fragment,{children:[e.jsx(_.Provider,{value:{stepIndex:p,setStepIndex:o,stepHistory:y,setStepHistory:g,onStepChange:i,stepperLength:l.Children.count(r)},children:e.jsx(H,{activeStep:p,orientation:"vertical",elevation:a?2:0,children:v})}),p>=l.Children.count(r)-1&&b]})}x.__docgenInfo={description:"",methods:[],displayName:"SimpleStepper",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};const $=R(t=>({root:{marginTop:t.spacing(3),"& button":{marginRight:t.spacing(1)}}}),{name:"BackstageSimpleStepperFooter"}),E=({text:t,handleClick:r})=>{const{t:a}=q(k);return e.jsx(T,{onClick:r,children:t||a("simpleStepper.reset")})},D=({text:t,handleClick:r,disabled:a,last:i,stepIndex:n})=>{const{t:p}=q(k);return e.jsx(T,{variant:"contained",color:"primary",disabled:a,"data-testid":`nextButton-${n}`,onClick:r,children:t||p(i?"simpleStepper.finish":"simpleStepper.next")})},M=({text:t,handleClick:r,disabled:a,stepIndex:i})=>{const{t:n}=q(k);return e.jsx(T,{variant:"outlined",color:"primary",disabled:a,"data-testid":`skipButton-${i}`,onClick:r,children:t||n("simpleStepper.skip")})},V=({text:t,handleClick:r,disabled:a,stepIndex:i})=>{const{t:n}=q(k);return e.jsx(T,{onClick:r,"data-testid":`backButton-${i}`,disabled:a,children:t||n("simpleStepper.back")})},I=({actions:t={},children:r})=>{const a=$(),{stepperLength:i,stepIndex:n,setStepIndex:p,stepHistory:o,setStepHistory:h,onStepChange:y}=l.useContext(_),g=(d,C)=>{C&&C(),y&&y(n,d),p(d)},v=()=>{const d=t.nextStep?t.nextStep(n,i-1):n+1;g(d,t.onNext),h([...o,d])},b=()=>{o.pop(),g(o[o.length-1],t.onBack),h([...o])},u=()=>{g(0,t.onRestart),h([0])};return e.jsxs(B,{className:a.root,children:[[void 0,!0].includes(t.showBack)&&n!==0&&e.jsx(V,{text:t.backText,handleClick:b,disabled:n===0,stepIndex:n}),t.showSkip&&e.jsx(M,{text:t.skipText,handleClick:v,disabled:!!i&&n>=i||!!t.canSkip&&!t.canSkip(),stepIndex:n}),[void 0,!0].includes(t.showNext)&&e.jsx(D,{text:t.nextText,handleClick:v,disabled:!!i&&n>=i||!!t.canNext&&!t.canNext(),stepIndex:n}),t.showRestart&&n!==0&&e.jsx(E,{text:t.restartText,handleClick:u,stepIndex:n}),r]})};E.__docgenInfo={description:"",methods:[],displayName:"RestartBtn",props:{text:{required:!1,tsType:{name:"string"},description:""},handleClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},stepIndex:{required:!0,tsType:{name:"number"},description:""}}};I.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperFooter",props:{actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:"",defaultValue:{value:"{}",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const A=R(t=>({end:{padding:t.spacing(3)}}),{name:"SimpleStepperStep"});function s(t){const{title:r,children:a,end:i,actions:n,...p}=t,o=A();return i?e.jsxs(B,{className:o.end,children:[e.jsx(N,{variant:"h6",children:r}),a,e.jsx(I,{actions:{...n||{},showNext:!1}})]}):e.jsxs(O,{...p,children:[e.jsx(F,{children:e.jsx(N,{variant:"h6",children:r})}),e.jsxs(P,{children:[a,e.jsx(I,{actions:n})]})]})}s.__docgenInfo={description:"",methods:[],displayName:"SimpleStepperStep",props:{title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactElement"},description:""},end:{required:!1,tsType:{name:"boolean"},description:""},actions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"showNext",value:{name:"boolean",required:!1}},{key:"canNext",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onNext",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"nextStep",value:{name:"signature",type:"function",raw:"(current: number, last: number) => number",signature:{arguments:[{type:{name:"number"},name:"current"},{type:{name:"number"},name:"last"}],return:{name:"number"}},required:!1}},{key:"nextText",value:{name:"string",required:!1}},{key:"showBack",value:{name:"boolean",required:!1}},{key:"backText",value:{name:"string",required:!1}},{key:"onBack",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"showRestart",value:{name:"boolean",required:!1}},{key:"canRestart",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onRestart",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"restartText",value:{name:"string",required:!1}},{key:"showSkip",value:{name:"boolean",required:!1}},{key:"canSkip",value:{name:"signature",type:"function",raw:"() => boolean",signature:{arguments:[],return:{name:"boolean"}},required:!1}},{key:"onSkip",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}},{key:"skipText",value:{name:"string",required:!1}}]}},description:""}}};const Oe={title:"Navigation/SimpleStepper",component:x},j={elevated:!1,activeStep:0},c=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]});c.args=j;const m=t=>{const[r,a]=l.useState(!1);return e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 with required field",actions:{canNext:()=>r},children:e.jsx(L,{variant:"outlined",placeholder:"Required*",onChange:i=>a(!!i.target.value)})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Step 3",children:e.jsx("div",{children:"This is the content for step 3"})})]})};m.args=j;const S=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1",children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})}),e.jsx(s,{title:"Success!",end:!0,children:e.jsx("div",{children:"You've completed the Stepper"})})]});S.args=j;const f=t=>e.jsxs(x,{...t,children:[e.jsx(s,{title:"Step 1 (Optional)",actions:{showSkip:!0},children:e.jsx("div",{children:"This is the content for step 1"})}),e.jsx(s,{title:"Step 2",children:e.jsx("div",{children:"This is the content for step 2"})})]});m.args=j;c.__docgenInfo={description:"",methods:[],displayName:"Default",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};m.__docgenInfo={description:"",methods:[],displayName:"ConditionalButtons",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};S.__docgenInfo={description:"",methods:[],displayName:"CompletionStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"OptionalStep",props:{elevated:{required:!1,tsType:{name:"boolean"},description:""},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(prevIndex: number, nextIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"prevIndex"},{type:{name:"number"},name:"nextIndex"}],return:{name:"void"}}},description:""},activeStep:{required:!1,tsType:{name:"number"},description:""}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`(args: StepperProps) => <SimpleStepper {...args}>
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
}`,...f.parameters?.docs?.source}}};const Fe=["Default","ConditionalButtons","CompletionStep","OptionalStep"];export{S as CompletionStep,m as ConditionalButtons,c as Default,f as OptionalStep,Fe as __namedExportsOrder,Oe as default};
