import{j as o}from"./iframe-BUNFJ-LL.js";import{c as e}from"./plugin-DfsIxsAq.js";import{S as l}from"./Grid-DBxLs0pG.js";import{C as m}from"./ComponentAccordion-CJ_BnSLA.js";import{w as a}from"./appWrappers-DwaX-D8B.js";import{T as i}from"./TemplateBackstageLogoIcon-Y0viUP_x.js";import{I as s}from"./InfoCard-OqQGZWM2.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CX2F1Eyu.js";import"./componentData-zDZJvmdk.js";import"./useAnalytics-BrGJTKfU.js";import"./useApp-DBsIRrNl.js";import"./useRouteRef-DmkHHcok.js";import"./index-SSMRT9Bs.js";import"./DialogTitle-hXdjHSFc.js";import"./Modal-Cwa9uuB3.js";import"./Portal-j32zjom2.js";import"./Backdrop-BXminUHH.js";import"./Button-D5VZkG9s.js";import"./useObservable-DQm2eMWh.js";import"./useIsomorphicLayoutEffect-CfM2gomt.js";import"./ExpandMore-BvmDc48x.js";import"./AccordionDetails-NEVFuKGX.js";import"./index-B9sM2jn7.js";import"./Collapse-oWd9G09k.js";import"./useAsync-BJYhKhAw.js";import"./useMountedState-ykOrhzDb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CxGOKSZj.js";import"./ErrorBoundary-D8c7Pies.js";import"./ErrorPanel-B1RREPgC.js";import"./WarningPanel-Ba3usJjp.js";import"./MarkdownContent-Baqdegrk.js";import"./CodeSnippet-BIdXEEly.js";import"./Box-E56LyC2U.js";import"./styled-BK7FZU9O.js";import"./CopyTextButton-Do76HFgY.js";import"./useCopyToClipboard-TXjlrrXP.js";import"./Tooltip-Cy4UhZnY.js";import"./Popper-Bi7zPSXU.js";import"./List-TXTv7s6H.js";import"./ListContext-DDohaQJk.js";import"./ListItem-DqtCuPtR.js";import"./ListItemText-Csz7vtMz.js";import"./LinkButton-k4dDLleo.js";import"./Link-9uhrDkOF.js";import"./lodash-Czox7iJy.js";import"./CardHeader-CfmBdIWt.js";import"./Divider-CRo1EOKz.js";import"./CardActions-BfUIEmfS.js";import"./BottomLink-BlsmOo41.js";import"./ArrowForward-d_wnYzhM.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
