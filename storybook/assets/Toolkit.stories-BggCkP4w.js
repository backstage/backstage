import{j as o}from"./iframe-CDMGjht1.js";import{c as e}from"./plugin-CiOtfWWm.js";import{S as l}from"./Grid-BgC6P4wx.js";import{C as m}from"./ComponentAccordion-Cdd8tXcv.js";import{w as a}from"./appWrappers-CeVFb9Sb.js";import{T as i}from"./TemplateBackstageLogoIcon-CGl6tQ3u.js";import{I as s}from"./InfoCard-BUwu9wAu.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CfrHLNSO.js";import"./componentData-BhfXY_7K.js";import"./useAnalytics-DNi1LI_h.js";import"./useApp-DP3Hy8Yt.js";import"./useRouteRef-BKp3R5P0.js";import"./index-K4DNRamS.js";import"./DialogTitle-BcD20zOV.js";import"./Modal-DiZS-g1t.js";import"./Portal-Dv12doci.js";import"./Backdrop-CYAcd77J.js";import"./Button-CJM2mVMw.js";import"./useObservable-BMqS9uye.js";import"./useIsomorphicLayoutEffect-BOxOOV-6.js";import"./ExpandMore-BW8Ytfi4.js";import"./AccordionDetails-xoWWWHy1.js";import"./index-B9sM2jn7.js";import"./Collapse-T-NVxaZE.js";import"./useAsync-F2seOW-M.js";import"./useMountedState-BCg_GyJl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-C3OBeIV7.js";import"./ErrorBoundary-DXFxbn_q.js";import"./ErrorPanel-CHa0fGo8.js";import"./WarningPanel-DI2PepE0.js";import"./MarkdownContent-Cqhsm4_s.js";import"./CodeSnippet-CLIpVCVn.js";import"./Box-Dh0DgXaN.js";import"./styled-BhiXTegV.js";import"./CopyTextButton-BUSczag8.js";import"./useCopyToClipboard-Dpkpx4yl.js";import"./Tooltip-CrUID85L.js";import"./Popper-CnWXkGYE.js";import"./List-BZ3qqjn-.js";import"./ListContext-ak2gE-qF.js";import"./ListItem-CGpakNnt.js";import"./ListItemText-DadlRFVX.js";import"./LinkButton-Bm0UAYAk.js";import"./Link-D_ooISTq.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CXqhzRgw.js";import"./Divider-BQTEKmhn.js";import"./CardActions-5HkeXWm_.js";import"./BottomLink-B7jTzdbr.js";import"./ArrowForward-BtyH-PNr.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
