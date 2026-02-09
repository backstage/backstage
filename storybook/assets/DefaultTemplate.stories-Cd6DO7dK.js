import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-CXYsSFqX.js";import{s as g,H as u}from"./plugin-CtBYKFwY.js";import{c as h}from"./api-jhn8vFaR.js";import{c as f}from"./catalogApiMock-Du_Q0Bd1.js";import{s as x}from"./api-D9jKqI1j.js";import{S as y}from"./SearchContext-CWgLiHyi.js";import{P as S}from"./Page-Bhw_X4l9.js";import{S as r}from"./Grid-CBLufU_i.js";import{b as k,a as j,c as C}from"./plugin-D4U0AyrD.js";import{T as P}from"./TemplateBackstageLogo-D1Ltqhoe.js";import{T as I}from"./TemplateBackstageLogoIcon-DCyV3F6Q.js";import{e as T}from"./routes-CHUBus_K.js";import{w as v}from"./appWrappers-DM9hoX1F.js";import{s as G}from"./StarredEntitiesApi-C4ViXcR3.js";import{M as A}from"./MockStarredEntitiesApi-DbVVe0Aw.js";import{I as B}from"./InfoCard-BhEjsNW2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-IzCJOiwo.js";import"./Plugin-CYVtm61E.js";import"./componentData-B-Xp-WjF.js";import"./useAnalytics-wpQnmzLK.js";import"./useApp-LC36H6z3.js";import"./useRouteRef-D_K4aVES.js";import"./index-mbELQmCK.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-CNZKjAjJ.js";import"./useMountedState-2cXymIoR.js";import"./DialogTitle-CexE-OMt.js";import"./Modal-D6jcPeuR.js";import"./Portal-y4yvUJUe.js";import"./Backdrop-DpZkZfXy.js";import"./Button-D0m-IwQo.js";import"./useObservable-Iu2rwe2U.js";import"./useIsomorphicLayoutEffect-D0goBYeo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BfiKMwCo.js";import"./ErrorBoundary-BYKn89zI.js";import"./ErrorPanel-3Zd2cLU-.js";import"./WarningPanel-DIYvPX_4.js";import"./ExpandMore-DJZlK5Sd.js";import"./AccordionDetails-CCv3FdOB.js";import"./index-B9sM2jn7.js";import"./Collapse-BITvwjhQ.js";import"./MarkdownContent-Brn2l3Aj.js";import"./CodeSnippet-DkEMDFHo.js";import"./Box-DCh7b65F.js";import"./styled-DYzq_tB8.js";import"./CopyTextButton-DFxCHX8I.js";import"./useCopyToClipboard-BZhXOA9g.js";import"./Tooltip-DYDrJaUH.js";import"./Popper-BaB5wJeP.js";import"./List-CDWQPT5T.js";import"./ListContext-CWoF9LZC.js";import"./ListItem-DLX99J84.js";import"./ListItemText-CvzrIeis.js";import"./LinkButton-DyFnZC8S.js";import"./Link-DWEj90Ez.js";import"./CardHeader-kRzKqXby.js";import"./Divider-DuenxdSn.js";import"./CardActions-DornRNWZ.js";import"./BottomLink-D1PtYDTo.js";import"./ArrowForward-Ak_-qeRR.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
