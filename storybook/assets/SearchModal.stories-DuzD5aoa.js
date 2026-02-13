import{j as t,W as u,K as p,X as g}from"./iframe-CTfOr1ix.js";import{r as h}from"./plugin-CTeSdQZ3.js";import{S as l,u as c,a as x}from"./useSearchModal-B6omt-6N.js";import{s as S,M}from"./api-CQ2dJml8.js";import{S as C}from"./SearchContext-CqzSXfh2.js";import{B as m}from"./Button-CewwKG_B.js";import{m as f}from"./makeStyles-1FwyOuiP.js";import{D as j,a as y,b as B}from"./DialogTitle-CWAjiH1W.js";import{B as D}from"./Box-CL14vfYs.js";import{S as n}from"./Grid-6mM_q0n-.js";import{S as I}from"./SearchType-CEx3TSJF.js";import{L as G}from"./List-Dpi1Ei3o.js";import{H as R}from"./DefaultResultListItem-DdAG0C89.js";import{w as k}from"./appWrappers-DS_xPVdC.js";import{SearchBar as v}from"./SearchBar-C0sa5l9b.js";import{S as T}from"./SearchResult-l7c29Ft4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-wMewbaDE.js";import"./Plugin-BgOhi4BI.js";import"./componentData-CQMJYY4y.js";import"./useAnalytics-BJHxI_mw.js";import"./useApp-BhpT63zQ.js";import"./useRouteRef-S5w5RoSG.js";import"./index-B-ObPmyF.js";import"./ArrowForward-CkKHON-S.js";import"./translation-maKBuW_I.js";import"./Page-DUBnFqdT.js";import"./useMediaQuery-DtTmkb0v.js";import"./Divider-CxhoRXjC.js";import"./ArrowBackIos-MiKfy8ZG.js";import"./ArrowForwardIos-Cf009KZf.js";import"./translation-DenfTuQw.js";import"./lodash-n8-yS5G5.js";import"./useAsync-B32B7Qp6.js";import"./useMountedState-g2Ku3pig.js";import"./Modal-BiWFAeZ0.js";import"./Portal-6Q34r_Nq.js";import"./Backdrop-BN4cgqTA.js";import"./styled-C_6pXOEP.js";import"./ExpandMore-Cdm4ed0t.js";import"./AccordionDetails-CKyiNgp-.js";import"./index-B9sM2jn7.js";import"./Collapse-SKy0v8ML.js";import"./ListItem-BHAZbz_b.js";import"./ListContext-BnXKdXJ6.js";import"./ListItemIcon-OuZ7nKIH.js";import"./ListItemText-Do1jigG-.js";import"./Tabs-BGHBkpF0.js";import"./KeyboardArrowRight-MoiziD7L.js";import"./FormLabel-BA_x_kZ5.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-EXLTXplW.js";import"./InputLabel-3RpmDvha.js";import"./Select-D4dSx3-r.js";import"./Popover-DJq5T8vs.js";import"./MenuItem-slGZhUWL.js";import"./Checkbox-CZzuYoWK.js";import"./SwitchBase-CsHr-_py.js";import"./Chip-DxELFxIw.js";import"./Link-BZTNDDiJ.js";import"./index-P4DR0u2t.js";import"./useObservable-D-HXaDcN.js";import"./useIsomorphicLayoutEffect-BN4bH0qe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CmC9J3OT.js";import"./useDebounce-CCDpmilO.js";import"./InputAdornment-j5CBOtVz.js";import"./TextField-B6NP0gpo.js";import"./useElementFilter-CKYfAQr5.js";import"./EmptyState-G9JmRW7V.js";import"./Progress-Cfm1L5bl.js";import"./LinearProgress-B24uBrMk.js";import"./ResponseErrorPanel-qS1m8f7r.js";import"./ErrorPanel-DBFyoG9y.js";import"./WarningPanel-CEnFu6C_.js";import"./MarkdownContent-Eyuxnq2G.js";import"./CodeSnippet-DqVn8wbQ.js";import"./CopyTextButton-C9gW30zO.js";import"./useCopyToClipboard-Bl9wB9IS.js";import"./Tooltip-bV63MOr0.js";import"./Popper-BxZ3wRuZ.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
