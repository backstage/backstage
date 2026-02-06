import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-Bfb6es7h.js";import{r as x}from"./plugin-Czl-hij-.js";import{S as l,u as c,a as S}from"./useSearchModal-ClKzeQ9F.js";import{s as M,M as C}from"./api-Bhq5iyV7.js";import{S as f}from"./SearchContext-DdfJXW0C.js";import{B as m}from"./Button-DgLe45Cx.js";import{D as j,a as y,b as B}from"./DialogTitle--znV04_h.js";import{B as D}from"./Box-C8tWNgkw.js";import{S as n}from"./Grid-fOEQuWsY.js";import{S as I}from"./SearchType-CWu0gBsh.js";import{L as G}from"./List-DdY4r3Qa.js";import{H as R}from"./DefaultResultListItem-D9zWP_62.js";import{w as k}from"./appWrappers-DdoKMAzO.js";import{SearchBar as v}from"./SearchBar-Dh_oiSDy.js";import{S as T}from"./SearchResult-BM6U2LBC.js";import"./preload-helper-PPVm8Dsz.js";import"./index-f1R-dcZD.js";import"./Plugin-CXIsHHNu.js";import"./componentData-ALPptmD3.js";import"./useAnalytics-CVOFFuvg.js";import"./useApp-kTvTF_u-.js";import"./useRouteRef-BqEacaGv.js";import"./index-BH1Qp3-H.js";import"./ArrowForward-CTIzHOFz.js";import"./translation-DlyoaUkq.js";import"./Page-F-BpEsaN.js";import"./useMediaQuery-BeWYv38j.js";import"./Divider-Dfh3vDVi.js";import"./ArrowBackIos-CwYs7SDV.js";import"./ArrowForwardIos-Dv0Oimvy.js";import"./translation-BCD5YnFA.js";import"./lodash-Czox7iJy.js";import"./useAsync-DkTP0ua2.js";import"./useMountedState-BiNiTtFn.js";import"./Modal-CMLC8fQ-.js";import"./Portal-DoGSafYV.js";import"./Backdrop-BFCoYjYZ.js";import"./styled-DNaQ7xBF.js";import"./ExpandMore-DoDRnIYA.js";import"./AccordionDetails-CKP4iHhe.js";import"./index-B9sM2jn7.js";import"./Collapse-DB4Tv0RR.js";import"./ListItem-CdGfarMd.js";import"./ListContext-DK41gHFX.js";import"./ListItemIcon-BLYXXBqb.js";import"./ListItemText-VDXTeYlf.js";import"./Tabs-CH1ElEDu.js";import"./KeyboardArrowRight-22sB0n56.js";import"./FormLabel-f684eXIp.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B2mOR3QN.js";import"./InputLabel-85EUBiAa.js";import"./Select-D3G4kv-0.js";import"./Popover-BH0ZmLnx.js";import"./MenuItem-CaV5lByc.js";import"./Checkbox-DVBPkFoA.js";import"./SwitchBase-B3yhqx9b.js";import"./Chip-CKhtGZse.js";import"./Link-BXHXb0Ac.js";import"./useObservable-D9R9w3U2.js";import"./useIsomorphicLayoutEffect-3QlRcHa3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DSQBwqES.js";import"./useDebounce-dZNuZiXB.js";import"./InputAdornment-C5_DIl-S.js";import"./TextField-BKgGshaK.js";import"./useElementFilter-DAhdZOno.js";import"./EmptyState-CF4Azm8W.js";import"./Progress-D99C8lQM.js";import"./LinearProgress-DDFM54_Z.js";import"./ResponseErrorPanel-6X6ol23N.js";import"./ErrorPanel-Cdw_oYMz.js";import"./WarningPanel-D8tYRIvI.js";import"./MarkdownContent-BP6bDfRC.js";import"./CodeSnippet-BB1hf6Ht.js";import"./CopyTextButton-Bg_o-RoR.js";import"./useCopyToClipboard-CxgcRXBX.js";import"./Tooltip-BIMvLisP.js";import"./Popper-C-IKLGjO.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
