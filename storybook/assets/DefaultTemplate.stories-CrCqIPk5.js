import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-DbI6eD9d.js";import{s as g,H as u}from"./plugin-DDarW-d_.js";import{c as h}from"./api-BsKVMWsg.js";import{c as f}from"./catalogApiMock-JbwMCrQO.js";import{s as x}from"./api-6E7uRubi.js";import{S as y}from"./SearchContext-CyGnXWb0.js";import{P as S}from"./Page-sqFbwbzm.js";import{S as r}from"./Grid-Bk30WVxK.js";import{b as k,a as j,c as C}from"./plugin-Cq85gQWd.js";import{T as P}from"./TemplateBackstageLogo-DAQHOjiw.js";import{T as I}from"./TemplateBackstageLogoIcon-kmgtuZMF.js";import{e as T}from"./routes-BXWy7Dsy.js";import{w as v}from"./appWrappers-ysziI5ZA.js";import{s as G}from"./StarredEntitiesApi-i2dMBefV.js";import{M as A}from"./MockStarredEntitiesApi-_8Ru1isY.js";import{I as B}from"./InfoCard-C7uWqAKI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DiAi4R73.js";import"./Plugin-Bb9hU_OU.js";import"./componentData-BY8qZ-sE.js";import"./useAnalytics-DxBTGODq.js";import"./useApp-By-GP-XF.js";import"./useRouteRef-DM8Co2Wr.js";import"./index-BpirQtKL.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-CgxXauOf.js";import"./useMountedState-x9skCR0V.js";import"./DialogTitle-Bnldogbn.js";import"./Modal-DSfyr1-Y.js";import"./Portal-1epzlOBv.js";import"./Backdrop-lRnFqTe6.js";import"./Button-BcRwA9XB.js";import"./useObservable-BAzjAwDp.js";import"./useIsomorphicLayoutEffect-BUXckimh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CaMsCQ3C.js";import"./ErrorBoundary-Pnzm6LGL.js";import"./ErrorPanel-DlUDd-32.js";import"./WarningPanel-M9-9T0mj.js";import"./ExpandMore-CGV1QMso.js";import"./AccordionDetails-BibEu-2M.js";import"./index-B9sM2jn7.js";import"./Collapse-DuLdQbrv.js";import"./MarkdownContent-BnX0THa8.js";import"./CodeSnippet-Cbn7wM4l.js";import"./Box-B_5N4RtH.js";import"./styled-Ca3T9n7C.js";import"./CopyTextButton-B5-s-8U_.js";import"./useCopyToClipboard-DYI1pKNQ.js";import"./Tooltip-Bq7wKed5.js";import"./Popper-9ImL6E1W.js";import"./List-B28Z8F3S.js";import"./ListContext-D83WNTGA.js";import"./ListItem-BiTyGeEf.js";import"./ListItemText-Cbx6sNjJ.js";import"./LinkButton-T-0yH8W0.js";import"./Link-BjQEuYrU.js";import"./CardHeader-DaQVS7Av.js";import"./Divider-CO6unGqT.js";import"./CardActions-B6MuYnHZ.js";import"./BottomLink-hMDyPyJY.js";import"./ArrowForward-0RbzQf1a.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
