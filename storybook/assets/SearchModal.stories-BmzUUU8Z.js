import{j as t,W as u,K as p,X as g}from"./iframe-DBRGxMDW.js";import{r as h}from"./plugin-DU6QPUAG.js";import{S as l,u as c,a as x}from"./useSearchModal-D2iMT1Y6.js";import{s as S,M}from"./api-25UvGkvi.js";import{S as C}from"./SearchContext-DFiCXZHi.js";import{B as m}from"./Button-DpQO2War.js";import{m as f}from"./makeStyles-ByaqqE0C.js";import{D as j,a as y,b as B}from"./DialogTitle-CGcVRAK6.js";import{B as D}from"./Box-CntJUP1x.js";import{S as n}from"./Grid-DUgNNeQ8.js";import{S as I}from"./SearchType-Bf0hQ5Py.js";import{L as G}from"./List-Dwh_b94U.js";import{H as R}from"./DefaultResultListItem-0RlCFPGL.js";import{w as k}from"./appWrappers-CLMfE3x2.js";import{SearchBar as v}from"./SearchBar-D9tc74ei.js";import{S as T}from"./SearchResult-DC7wyH0_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B7_4D80F.js";import"./Plugin-Cd2QbvHH.js";import"./componentData-D6Sj_KyX.js";import"./useAnalytics-D5q7uOOi.js";import"./useApp-CcMjJuGU.js";import"./useRouteRef-uW68bNJS.js";import"./index-DxdJ_Qst.js";import"./ArrowForward-CdO8vXV_.js";import"./translation-BK5tBG2c.js";import"./Page-DwaTr6ZR.js";import"./useMediaQuery-DL1CJlMV.js";import"./Divider-C3R9iOnK.js";import"./ArrowBackIos-DHxryra6.js";import"./ArrowForwardIos-QzgQx8FM.js";import"./translation-BlhQgS4N.js";import"./lodash-WiBjX-DP.js";import"./useAsync-DDQcwHS7.js";import"./useMountedState-B06bP6zn.js";import"./Modal-rv70b7ym.js";import"./Portal-DK6syPsc.js";import"./Backdrop-CZIYdcSF.js";import"./styled-BtxC7hTc.js";import"./ExpandMore-BJVel_cX.js";import"./AccordionDetails-B05jq2YI.js";import"./index-B9sM2jn7.js";import"./Collapse-DdFfCEeX.js";import"./ListItem-DtNY3IdH.js";import"./ListContext-GpQvqqGL.js";import"./ListItemIcon-B9CFkG-W.js";import"./ListItemText-5EBnSTxE.js";import"./Tabs-CYlI39wz.js";import"./KeyboardArrowRight-BVGxNOE2.js";import"./FormLabel-DywPnsBR.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CLRSUvqo.js";import"./InputLabel-iFUPkHxK.js";import"./Select-B-JRi-Mf.js";import"./Popover-Dy1amroM.js";import"./MenuItem-CVGEXMmJ.js";import"./Checkbox-labJzrit.js";import"./SwitchBase-B6Ds2kod.js";import"./Chip-DOSPd66_.js";import"./Link-YCp9P7xP.js";import"./index-DeG_piPF.js";import"./useObservable-c3UBfxWB.js";import"./useIsomorphicLayoutEffect-CZmVjjAx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DQivrIU4.js";import"./useDebounce-IEpynpQo.js";import"./InputAdornment-C9ZMeuuU.js";import"./TextField-BwEy6iqx.js";import"./useElementFilter-Cu9QqFvo.js";import"./EmptyState-AStqI1zV.js";import"./Progress-Bx7Di4yx.js";import"./LinearProgress-D-D4-b0S.js";import"./ResponseErrorPanel-COjmtLQZ.js";import"./ErrorPanel-B6C3U4LZ.js";import"./WarningPanel-BMIQ5GyE.js";import"./MarkdownContent-CzuJJ67p.js";import"./CodeSnippet-CAZt93aq.js";import"./CopyTextButton-ClL_MRRy.js";import"./useCopyToClipboard-CSzcS2W-.js";import"./Tooltip-DE5RCm9h.js";import"./Popper-BGeENWN1.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
