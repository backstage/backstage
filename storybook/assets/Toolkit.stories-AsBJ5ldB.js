import{j as o}from"./iframe-Bfb6es7h.js";import{c as e}from"./plugin-BrovwtcV.js";import{S as l}from"./Grid-fOEQuWsY.js";import{C as m}from"./ComponentAccordion-BvAsSRYw.js";import{w as a}from"./appWrappers-DdoKMAzO.js";import{T as i}from"./TemplateBackstageLogoIcon-DwCn7Rkd.js";import{I as s}from"./InfoCard-D7aUfm_W.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CXIsHHNu.js";import"./componentData-ALPptmD3.js";import"./useAnalytics-CVOFFuvg.js";import"./useApp-kTvTF_u-.js";import"./useRouteRef-BqEacaGv.js";import"./index-BH1Qp3-H.js";import"./DialogTitle--znV04_h.js";import"./Modal-CMLC8fQ-.js";import"./Portal-DoGSafYV.js";import"./Backdrop-BFCoYjYZ.js";import"./Button-DgLe45Cx.js";import"./useObservable-D9R9w3U2.js";import"./useIsomorphicLayoutEffect-3QlRcHa3.js";import"./ExpandMore-DoDRnIYA.js";import"./AccordionDetails-CKP4iHhe.js";import"./index-B9sM2jn7.js";import"./Collapse-DB4Tv0RR.js";import"./useAsync-DkTP0ua2.js";import"./useMountedState-BiNiTtFn.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D42-qhAJ.js";import"./ErrorBoundary-RfTVQpC0.js";import"./ErrorPanel-Cdw_oYMz.js";import"./WarningPanel-D8tYRIvI.js";import"./MarkdownContent-BP6bDfRC.js";import"./CodeSnippet-BB1hf6Ht.js";import"./Box-C8tWNgkw.js";import"./styled-DNaQ7xBF.js";import"./CopyTextButton-Bg_o-RoR.js";import"./useCopyToClipboard-CxgcRXBX.js";import"./Tooltip-BIMvLisP.js";import"./Popper-C-IKLGjO.js";import"./List-DdY4r3Qa.js";import"./ListContext-DK41gHFX.js";import"./ListItem-CdGfarMd.js";import"./ListItemText-VDXTeYlf.js";import"./LinkButton-BgEyZHgU.js";import"./Link-BXHXb0Ac.js";import"./lodash-Czox7iJy.js";import"./CardHeader-hEQM7px_.js";import"./Divider-Dfh3vDVi.js";import"./CardActions-DwnWnO57.js";import"./BottomLink-P4zcIuMj.js";import"./ArrowForward-CTIzHOFz.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
