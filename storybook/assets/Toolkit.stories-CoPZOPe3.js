import{j as o}from"./iframe-PR9K1gR4.js";import{c as e}from"./plugin-CJzI0Twe.js";import{S as l}from"./Grid-BDCj0xnW.js";import{C as m}from"./ComponentAccordion-B-UbnK7o.js";import{w as a}from"./appWrappers-DEOTEiR9.js";import{T as i}from"./TemplateBackstageLogoIcon-bO5k4DsK.js";import{I as s}from"./InfoCard-BsnUWDGu.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DNmMI31j.js";import"./componentData-o86LZs6r.js";import"./useAnalytics-D2YlE8CY.js";import"./useApp-BW5Yca7D.js";import"./useRouteRef-B521NRec.js";import"./index-qP2Hr3Qu.js";import"./DialogTitle-B59kuhfC.js";import"./Modal-DgU04yZ2.js";import"./Portal-CHANQNTr.js";import"./Backdrop-B3ZiF5N6.js";import"./Button-DAulvpLo.js";import"./useObservable-BhXF4yMN.js";import"./ExpandMore-C65eZJGL.js";import"./AccordionDetails-C_jBxEzP.js";import"./index-DnL3XN75.js";import"./Collapse-B00qmsYa.js";import"./useAsync-CdCMGCNf.js";import"./useMountedState-9lLipg6w.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-D7oLkQ_y.js";import"./ErrorBoundary-Cp4UMxdi.js";import"./ErrorPanel-wKrI7pp5.js";import"./WarningPanel-BdWxPo3h.js";import"./MarkdownContent-CPx5kcko.js";import"./CodeSnippet-BcyQuG45.js";import"./Box-DE3El2Us.js";import"./styled-BWfK9xAq.js";import"./CopyTextButton-EKDV7SOv.js";import"./useCopyToClipboard-Dv8Ke7sP.js";import"./Tooltip-NKLLE1oV.js";import"./Popper-C2P8lryL.js";import"./List-9O5jesKH.js";import"./ListContext-d9I9drbR.js";import"./ListItem-BSmKrE7c.js";import"./ListItemText-BDaGpWdO.js";import"./LinkButton-DfUc1wjm.js";import"./Link-8mF5gqTh.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BkJyBP81.js";import"./Divider-C49XG7LX.js";import"./CardActions-BBsiP_-o.js";import"./BottomLink-D_BnnSpC.js";import"./ArrowForward-B-qxFdBl.js";const so={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const co=["Default","InAccordion"];export{r as Default,t as InAccordion,co as __namedExportsOrder,so as default};
