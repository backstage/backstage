import{j as t,m as u,I as p,b as g,T as h}from"./iframe-XFwexWAC.js";import{r as x}from"./plugin-Dwqv5ZOr.js";import{S as l,u as c,a as S}from"./useSearchModal-BRKlL9Wj.js";import{B as m}from"./Button-CfP9f6s1.js";import{a as M,b as C,c as f}from"./DialogTitle-DjDrvKqf.js";import{B as j}from"./Box-DOcmf_lA.js";import{S as n}from"./Grid-QGplJCTn.js";import{S as y}from"./SearchType-B1kvPL8Y.js";import{L as I}from"./List-cHbFQZE_.js";import{H as B}from"./DefaultResultListItem-BE7v-YoV.js";import{s as D,M as G}from"./api-BjMKO4Ip.js";import{S as R}from"./SearchContext-Bwr8H3vU.js";import{w as T}from"./appWrappers-70i-hxtl.js";import{SearchBar as k}from"./SearchBar-oFsfDmH6.js";import{a as v}from"./SearchResult-DC659VwW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DEcX1i1Z.js";import"./Plugin-DRnkdvxE.js";import"./componentData-BgE2FK5U.js";import"./useAnalytics-BpI3YstQ.js";import"./useApp-D2Je31QU.js";import"./useRouteRef-B_kQk1xP.js";import"./index-BjVSwF8u.js";import"./ArrowForward-lqL8v-HC.js";import"./translation-CYJtux8m.js";import"./Page-DHF212Z7.js";import"./useMediaQuery-DdhFJJvM.js";import"./Divider-AcqAP6v2.js";import"./ArrowBackIos-t9tifwtX.js";import"./ArrowForwardIos-D8c991C6.js";import"./translation-D-Mk3huD.js";import"./Modal-BKS56bVv.js";import"./Portal-DGqwvRCH.js";import"./Backdrop-BSizeznv.js";import"./styled-CDWDroQT.js";import"./ExpandMore-DmZgnz1E.js";import"./useAsync-CTNfJ6Gv.js";import"./useMountedState-D8mLU74K.js";import"./AccordionDetails-vmXM40VX.js";import"./index-B9sM2jn7.js";import"./Collapse-BtERTKf9.js";import"./ListItem-BEnPhwl_.js";import"./ListContext-B0O1h7iD.js";import"./ListItemIcon-DYqGMBoP.js";import"./ListItemText-DimjlXkG.js";import"./Tabs-CGQ8sF2_.js";import"./KeyboardArrowRight-D7tRDeij.js";import"./FormLabel-CTwQ0ijh.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-vZc3_jkZ.js";import"./InputLabel-dk7h2aR5.js";import"./Select-BiZa7U2_.js";import"./Popover-CVjrgcBr.js";import"./MenuItem-CfIzosgl.js";import"./Checkbox-DON7r79u.js";import"./SwitchBase-CwGiJYfM.js";import"./Chip-jjvn6ODK.js";import"./Link-YMEncvsI.js";import"./lodash-DLuUt6m8.js";import"./useObservable-BHUrIwGk.js";import"./useIsomorphicLayoutEffect-rnOglJxN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-D5huT6yc.js";import"./useDebounce-tO4kZcNF.js";import"./InputAdornment-B3u3JFXL.js";import"./TextField-Cxr_oRcd.js";import"./useElementFilter-DRbcGvCE.js";import"./EmptyState-CBO7Dm5r.js";import"./Progress-BzcYe5db.js";import"./LinearProgress-CkBhpkbV.js";import"./ResponseErrorPanel-B34mXLgu.js";import"./ErrorPanel-0ntfFJ4u.js";import"./WarningPanel-CWtEeF6X.js";import"./MarkdownContent-DGJWTS_J.js";import"./CodeSnippet-B745YxT9.js";import"./CopyTextButton-BU9NUfM0.js";import"./useCopyToClipboard-BxYbXeOS.js";import"./Tooltip-pAeb8IBW.js";import"./Popper-Cpjma44V.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
