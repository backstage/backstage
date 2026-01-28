import{j as t,m as u,I as p,b as g,T as h}from"./iframe-DFdcbEiJ.js";import{r as x}from"./plugin--hf6owca.js";import{S as l,u as c,a as S}from"./useSearchModal-RANQs12_.js";import{B as m}from"./Button-D7n_65H8.js";import{a as M,b as C,c as f}from"./DialogTitle-D_BPwkq2.js";import{B as j}from"./Box-BjQGvIzi.js";import{S as n}from"./Grid-Bz80tPVF.js";import{S as y}from"./SearchType-Bimmm-Oh.js";import{L as I}from"./List-C-NEuts9.js";import{H as B}from"./DefaultResultListItem-C3tBt1mN.js";import{s as D,M as G}from"./api-CdNNLJvk.js";import{S as R}from"./SearchContext-BqsK_f-n.js";import{w as T}from"./appWrappers-DpruEjTR.js";import{SearchBar as k}from"./SearchBar--YkTnL3B.js";import{a as v}from"./SearchResult-DioSdOXQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dz0ZCZoc.js";import"./Plugin-Bs6oqM75.js";import"./componentData-DKayDtyx.js";import"./useAnalytics-CExwtm2Z.js";import"./useApp--XwcR16b.js";import"./useRouteRef-Ctloo__U.js";import"./index-CJ8jAIcI.js";import"./ArrowForward-CG_5dhQW.js";import"./translation-CtCuXRft.js";import"./Page-CXzpmwbi.js";import"./useMediaQuery-I3sssiq_.js";import"./Divider-DmWFkQ65.js";import"./ArrowBackIos-aErPd9HD.js";import"./ArrowForwardIos-CoP2JxK8.js";import"./translation-DpfNOtUj.js";import"./Modal-CT70aByk.js";import"./Portal-DjeB-iF_.js";import"./Backdrop-B3-TbVKs.js";import"./styled-DNdG2dK3.js";import"./ExpandMore-CCqXodF2.js";import"./useAsync-D295T4Y3.js";import"./useMountedState-B2v2il8B.js";import"./AccordionDetails-DWgDfIG0.js";import"./index-B9sM2jn7.js";import"./Collapse-Bi_tnvhP.js";import"./ListItem-LVIqWJQW.js";import"./ListContext-D0DH-Ku-.js";import"./ListItemIcon-DQ2TNxYT.js";import"./ListItemText-cZEZ1Dk-.js";import"./Tabs-CDjF8zfa.js";import"./KeyboardArrowRight-CJ3nMAIg.js";import"./FormLabel-CZwUel4f.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BqRsDBrA.js";import"./InputLabel-CxqAwXRF.js";import"./Select-DDuCUY7L.js";import"./Popover-Dn9yIWV_.js";import"./MenuItem-BCZH5xvU.js";import"./Checkbox-DIhSajqD.js";import"./SwitchBase-DjtETkZG.js";import"./Chip-CmI2CSrv.js";import"./Link-Din0jYMc.js";import"./lodash-Czox7iJy.js";import"./useObservable-g2KqN0oS.js";import"./useIsomorphicLayoutEffect-Cf9o0_mJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Cb41aqJq.js";import"./useDebounce-etu2bQvE.js";import"./InputAdornment-DT7AxNz5.js";import"./TextField-DCkBGwwY.js";import"./useElementFilter-DtSqRIf0.js";import"./EmptyState-CLIkgHcg.js";import"./Progress-DflYAivm.js";import"./LinearProgress-Dcn6szPv.js";import"./ResponseErrorPanel-D8Ggzb_p.js";import"./ErrorPanel-B3OsaLRR.js";import"./WarningPanel-D07MgOJm.js";import"./MarkdownContent-yQMqdqzq.js";import"./CodeSnippet-BkmLPXrW.js";import"./CopyTextButton-QsOg2zVP.js";import"./useCopyToClipboard-CoHAd7Ub.js";import"./Tooltip-D0BdWwmK.js";import"./Popper-zn-2LFE5.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
