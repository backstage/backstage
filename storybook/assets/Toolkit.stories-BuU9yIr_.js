import{j as o}from"./iframe-CDQkRPtg.js";import{c as e}from"./plugin-CahDXici.js";import{S as l}from"./Grid-CLxLLrBH.js";import{C as m}from"./ComponentAccordion-DrVNdxbl.js";import{w as a}from"./appWrappers-CE0QY808.js";import{T as i}from"./TemplateBackstageLogoIcon-ClK3dQeJ.js";import{I as s}from"./InfoCard-dA-QAsvX.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-7Q4zKQYi.js";import"./componentData-DYzzNs7d.js";import"./useAnalytics-SrifWrGy.js";import"./useApp-C8xAL1g0.js";import"./useRouteRef-BSUaPuHo.js";import"./index-SymPTtRB.js";import"./DialogTitle-DWkQ60T4.js";import"./Modal-BVCBWYhk.js";import"./Portal-uMAxVVb4.js";import"./Backdrop-ZHSEXCO8.js";import"./Button-CJBsb64p.js";import"./useObservable-B4YdM9yx.js";import"./useIsomorphicLayoutEffect-bknZ9h7N.js";import"./ExpandMore-Bwto4mGt.js";import"./AccordionDetails-Cp5Nx1Lx.js";import"./index-B9sM2jn7.js";import"./Collapse-DIN7Ymif.js";import"./useAsync-BT3fPnna.js";import"./useMountedState-C2nQ5XSq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DzRD3wyO.js";import"./ErrorBoundary-BlIVd69u.js";import"./ErrorPanel-BvnDxryc.js";import"./WarningPanel-DP_PPUp-.js";import"./MarkdownContent-aPcN5Cf2.js";import"./CodeSnippet-CRThj8mN.js";import"./Box-CFWJqO9C.js";import"./styled-CcM8fDvt.js";import"./CopyTextButton-D-Xv6vTC.js";import"./useCopyToClipboard-DyF_TS4U.js";import"./Tooltip-BVQgiQsu.js";import"./Popper-fSAvrd0-.js";import"./List-Ciyy1sk9.js";import"./ListContext-C9VfLDtj.js";import"./ListItem-CsL3oSDi.js";import"./ListItemText-DHloRduP.js";import"./LinkButton-bAeWiGNF.js";import"./Link-BIWx4pmj.js";import"./lodash-m4O8l6WS.js";import"./CardHeader-D827vOQ6.js";import"./Divider-o218nSC0.js";import"./CardActions-Cyv3XIno.js";import"./BottomLink-BRs4vojn.js";import"./ArrowForward-hXXdPwwK.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
