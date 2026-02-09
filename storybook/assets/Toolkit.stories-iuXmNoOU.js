import{j as o}from"./iframe-CafSZihE.js";import{c as e}from"./plugin-B90-0LX7.js";import{S as l}from"./Grid-CE8ncWjM.js";import{C as m}from"./ComponentAccordion-ZYIIYNPT.js";import{w as a}from"./appWrappers-Bm81Y_Ag.js";import{T as i}from"./TemplateBackstageLogoIcon-CofSRc5V.js";import{I as s}from"./InfoCard-BEiRq27A.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CmWRPz1q.js";import"./componentData-BMaKz9VF.js";import"./useAnalytics-CkIdISEJ.js";import"./useApp-BWekrYpt.js";import"./useRouteRef-Bk50-K9_.js";import"./index-CWZByKrh.js";import"./DialogTitle-BOLKbyFf.js";import"./Modal-119bZl-Y.js";import"./Portal-W2FhbA1a.js";import"./Backdrop-CN6b5uOg.js";import"./Button-DR_OBMXZ.js";import"./useObservable-C7I0Kmlp.js";import"./useIsomorphicLayoutEffect-rUIA2I1q.js";import"./ExpandMore-B67diL7X.js";import"./AccordionDetails-CZxQwlea.js";import"./index-B9sM2jn7.js";import"./Collapse-uTAZOzA3.js";import"./useAsync-CWT4UngH.js";import"./useMountedState-Bx1mDZHi.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BfmK405P.js";import"./ErrorBoundary-Dqj2pINV.js";import"./ErrorPanel-Cbj0fdBm.js";import"./WarningPanel-BCt9Bv9g.js";import"./MarkdownContent-C9IhCAop.js";import"./CodeSnippet-BTTGQVt6.js";import"./Box-fRbsHjDs.js";import"./styled-XhcyHdDa.js";import"./CopyTextButton-Xa9XWeEV.js";import"./useCopyToClipboard-C5jlCbNf.js";import"./Tooltip-CWOPvmrv.js";import"./Popper-DcG5vPGv.js";import"./List-B4E6UX55.js";import"./ListContext-CWAV-zjc.js";import"./ListItem-DVuo4x9u.js";import"./ListItemText-B-CF-Ijo.js";import"./LinkButton-BpIPCZdv.js";import"./Link-DyiL97g3.js";import"./lodash-Czox7iJy.js";import"./CardHeader-BM2nPM7u.js";import"./Divider-C4EwzhjR.js";import"./CardActions-CTRx52Db.js";import"./BottomLink-XuI9KdJO.js";import"./ArrowForward-B_DalRq-.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
