import{j as o}from"./iframe-BVVWNhNF.js";import{c as e}from"./plugin-DSi8Ut2S.js";import{S as l}from"./Grid-BhWDjvJh.js";import{C as m}from"./ComponentAccordion-Cvd6xo4K.js";import{w as a}from"./appWrappers-ChYKtzjD.js";import{T as i}from"./TemplateBackstageLogoIcon-DUgWMVaO.js";import{I as s}from"./InfoCard-pIukSdGf.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CgTcVBUB.js";import"./componentData-CcSGmjOp.js";import"./useAnalytics-DOlQNDHl.js";import"./useApp-CDZ4N_T1.js";import"./useRouteRef-BBaiKSnw.js";import"./index-Cytn1js_.js";import"./DialogTitle-Y7DgGyxp.js";import"./Modal-BSykfrg4.js";import"./Portal-DukR7Qds.js";import"./Backdrop-Dz78wVML.js";import"./Button-BmiFnTzM.js";import"./useObservable-UOYoI0kL.js";import"./useIsomorphicLayoutEffect-C2UzxJwg.js";import"./ExpandMore-DowbklPi.js";import"./AccordionDetails-RAdNuemB.js";import"./index-B9sM2jn7.js";import"./Collapse-BYFMHxpC.js";import"./useAsync-C3TxRl9Y.js";import"./useMountedState-Lmv_QRT4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DDwUqD8r.js";import"./ErrorBoundary-DC0OPPNH.js";import"./ErrorPanel-CIBQJLIP.js";import"./WarningPanel-BKd-aVLN.js";import"./MarkdownContent-DIwENC3V.js";import"./CodeSnippet-DsEjqB14.js";import"./Box-I6qpNjup.js";import"./styled-BXlk9tEQ.js";import"./CopyTextButton-D4a_r689.js";import"./useCopyToClipboard-BPci2e7u.js";import"./Tooltip-B6-nubZA.js";import"./Popper-CpEGPy4_.js";import"./List-CeUn_h_G.js";import"./ListContext-D6HHPv4d.js";import"./ListItem-896bCnNz.js";import"./ListItemText-rQpXHQMd.js";import"./LinkButton-BtHpMbGF.js";import"./Link-C8sZRddr.js";import"./lodash-Czox7iJy.js";import"./CardHeader-D1smsiqM.js";import"./Divider-BEnyyVTc.js";import"./CardActions-COAPAgyc.js";import"./BottomLink-BS8gfZ3p.js";import"./ArrowForward-B0TORj3F.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
