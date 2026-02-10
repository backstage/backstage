import{j as e,m as N,r as d,U as k}from"./iframe-BDvXWqMv.js";import{S as z,L as B}from"./Label-Bkbgwr3S.js";import{s as W,M as q}from"./api-D4OhEijw.js";import{S as T,u as E}from"./SearchContext-C1PZ8VcQ.js";import{SearchBar as H}from"./SearchBar-6YEmyrYL.js";import{A as M}from"./Autocomplete-DMrUGPAt.js";import{C as V}from"./CircularProgress-6HJVeumJ.js";import{S as P}from"./Grid-SEE3Vji4.js";import{w as G}from"./appWrappers-D7GkfUM0.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-CbobYgFd.js";import"./ListContext-BMD4k7rh.js";import"./ListItemText-BChUSAmp.js";import"./lodash-DTh7qDqK.js";import"./useAsync-CZTayVe5.js";import"./useMountedState-DRPCbnV1.js";import"./useAnalytics-Bhj43Yb4.js";import"./Search-CUDhOYN0.js";import"./useDebounce-DuXS03T0.js";import"./translation-BolybVC0.js";import"./InputAdornment-BYAn4HXN.js";import"./useFormControl-0HA80AJJ.js";import"./Button-D_oOYcjF.js";import"./TextField-DwKruZgA.js";import"./Select-BNHe7A3b.js";import"./index-B9sM2jn7.js";import"./Popover-D_XQo6qj.js";import"./Modal-aUjOD6G2.js";import"./Portal-Bxsqc2Ff.js";import"./List-BCScUoZK.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-sGgvABuH.js";import"./InputLabel-CyzBuKnt.js";import"./useApp-XW1Y_59p.js";import"./Chip-BfcATEKy.js";import"./Popper-CBqxIWf4.js";import"./ListSubheader-BhN7U6Mn.js";import"./useObservable-C5WBInFh.js";import"./useIsomorphicLayoutEffect-Ckaa7XZb.js";import"./componentData-8WYIPpYM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CuoyrUh2.js";const U=N(t=>({loading:{right:t.spacing(1),position:"absolute"}})),F=t=>c=>e.jsx(T,{inheritParentContextIfAvailable:!0,children:e.jsx(t,{...c})}),J=()=>{const t=U();return e.jsx(V,{className:t.loading,"data-testid":"search-autocomplete-progressbar",color:"inherit",size:20})},p=F(function(c){const{loading:x,value:u,onChange:S=()=>{},options:w=[],getOptionLabel:h=o=>String(o),inputPlaceholder:g,inputDebounceTime:A,freeSolo:b=!0,fullWidth:j=!0,clearOnBlur:C=!1,"data-testid":_="search-autocomplete",...L}=c,{setTerm:y}=E(),l=d.useCallback(o=>o?typeof o=="string"?o:h(o):"",[h]),I=d.useMemo(()=>l(u),[u,l]),R=d.useCallback((o,m,f,O)=>{y(l(m)),S(o,m,f,O)},[l,y,S]),v=d.useCallback(({InputProps:{ref:o,className:m,endAdornment:f},InputLabelProps:O,...D})=>e.jsx(H,{...D,ref:o,clearButton:!1,value:I,placeholder:g,debounceTime:A,endAdornment:x?e.jsx(J,{}):f,InputProps:{className:m}}),[x,I,g,A]);return e.jsx(M,{...L,"data-testid":_,value:u,onChange:R,options:w,getOptionLabel:h,renderInput:v,freeSolo:b,fullWidth:j,clearOnBlur:C})});p.__docgenInfo={description:`Recommended search autocomplete when you use the Search Provider or Search Context.

@public`,methods:[],displayName:"SearchAutocomplete",props:{"data-testid":{required:!1,tsType:{name:"string"},description:""},inputPlaceholder:{required:!1,tsType:{name:"Partial['placeholder']",raw:"SearchBarProps['placeholder']"},description:""},inputDebounceTime:{required:!1,tsType:{name:"Partial['debounceTime']",raw:"SearchBarProps['debounceTime']"},description:""}}};const We={title:"Plugins/Search/SearchAutocomplete",component:p,decorators:[t=>G(e.jsx(k,{apis:[[W,new q]],children:e.jsx(T,{children:e.jsx(P,{container:!0,direction:"row",children:e.jsx(P,{item:!0,xs:12,children:e.jsx(t,{})})})})}))],tags:["!manifest"]},r=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),s=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),n=()=>{const t=["hello-word","petstore","spotify"];return e.jsx(p,{options:t,value:t[0]})},a=()=>e.jsx(p,{options:[],loading:!0}),i=()=>{const t=[{title:"hello-world",text:"Hello World example for gRPC"},{title:"petstore",text:"The petstore API"},{title:"spotify",text:"The Spotify web API"}];return e.jsx(p,{options:t,renderOption:c=>e.jsx(z,{icon:e.jsx(B,{titleAccess:"Option icon"}),primaryText:c.title,secondaryText:c.text})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Outlined"};n.__docgenInfo={description:"",methods:[],displayName:"Initialized"};a.__docgenInfo={description:"",methods:[],displayName:"LoadingOptions"};i.__docgenInfo={description:"",methods:[],displayName:"RenderingCustomOptions"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Outlined = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Initialized = () => {
  const options = ["hello-word", "petstore", "spotify"];
  return <SearchAutocomplete options={options} value={options[0]} />;
};
`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const LoadingOptions = () => {
  return <SearchAutocomplete options={[]} loading />;
};
`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const RenderingCustomOptions = () => {
  const options = [
    {
      title: "hello-world",
      text: "Hello World example for gRPC",
    },
    {
      title: "petstore",
      text: "The petstore API",
    },
    {
      title: "spotify",
      text: "The Spotify web API",
    },
  ];

  return (
    <SearchAutocomplete
      options={options}
      renderOption={(option) => (
        <SearchAutocompleteDefaultOption
          icon={<LabelIcon titleAccess="Option icon" />}
          primaryText={option.title}
          secondaryText={option.text}
        />
      )}
    />
  );
};
`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const options = ['hello-word', 'petstore', 'spotify'];
  return <SearchAutocomplete options={options} value={options[0]} />;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={[]} loading />;
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const options = [{
    title: 'hello-world',
    text: 'Hello World example for gRPC'
  }, {
    title: 'petstore',
    text: 'The petstore API'
  }, {
    title: 'spotify',
    text: 'The Spotify web API'
  }];
  return <SearchAutocomplete options={options} renderOption={option => <SearchAutocompleteDefaultOption icon={<LabelIcon titleAccess="Option icon" />} primaryText={option.title} secondaryText={option.text} />} />;
}`,...i.parameters?.docs?.source}}};const qe=["Default","Outlined","Initialized","LoadingOptions","RenderingCustomOptions"];export{r as Default,n as Initialized,a as LoadingOptions,s as Outlined,i as RenderingCustomOptions,qe as __namedExportsOrder,We as default};
